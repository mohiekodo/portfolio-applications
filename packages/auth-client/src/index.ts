import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { z } from 'zod';

// Custom Error Classes
class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Application Types Enum
export enum ApplicationType {
  StoreManagement = 'StoreManagement',
  ClinicManagement = 'ClinicManagement',
  PropertyManagement = 'PropertyManagement',
}

export interface IPaginatedResponse {
  users: IUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ITokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

// Validation Schemas
const UserValidationSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  application: z.nativeEnum(ApplicationType),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

const UserUpdateValidationSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  application: z.nativeEnum(ApplicationType).optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  application: ApplicationType;
  token: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  application: {
    type: String,
    required: true,
    enum: Object.values(ApplicationType),
  },
  token: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String },
  deletedAt: { type: String },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      throw new AuthError('Error hashing password');
    }
  }
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);

export class AuthClient {
  private readonly connectionString: string;
  private retryAttempts: number = 5;
  private retryDelay: number = 5000;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
    void this.connect();
  }

  private async connect(): Promise<void> {
    let attempts = 0;
    while (attempts < this.retryAttempts) {
      try {
        await mongoose.connect(this.connectionString);
        console.log('Connected to MongoDB');
        break;
      } catch (error: unknown) {
        attempts++;
        console.error(`Connection attempt ${attempts} failed: ${error as string}`);
        if (attempts === this.retryAttempts) {
          throw new DatabaseError('Failed to connect to MongoDB');
        }
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  private validateUserData(userData: Partial<IUser>): z.infer<typeof UserValidationSchema> {
    try {
      return UserValidationSchema.parse(userData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      throw new ValidationError(`Invalid user data: ${errorMessage}`);
    }
  }

  private validateUserUpdateData(
    userData: Partial<IUser>
  ): z.infer<typeof UserUpdateValidationSchema> {
    try {
      return UserUpdateValidationSchema.parse(userData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      throw new ValidationError(`Invalid user data: ${errorMessage}`);
    }
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const validatedData = this.validateUserData(userData);

      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        throw new ValidationError('Email already exists');
      }

      const user = new User({
        ...validatedData,
        createdAt: new Date().toISOString(),
      });

      return await user.save();
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      throw new DatabaseError(`Error creating user: ${errorMessage}`);
    }
  }

  async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    try {
      if (updates.password) {
        throw new ValidationError('Password cannot be updated through this method');
      }

      const validatedData = this.validateUserUpdateData(updates);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            ...validatedData,
            updatedAt: new Date().toISOString(),
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new ValidationError('User not found');
      }

      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      throw new DatabaseError(`Error updating user: ${errorMessage}`);
    }
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          isDeleted: true,
          isActive: false,
          deletedAt: new Date().toISOString(),
        },
        { new: true }
      );

      if (!user) {
        throw new ValidationError('User not found');
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      throw new DatabaseError(`Error deleting user: ${errorMessage}`);
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ _id: userId, isDeleted: false });
      if (!user) {
        throw new ValidationError('User not found');
      }
      return user;
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      throw new DatabaseError(`Error fetching user: ${errorMessage}`);
    }
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      const user = await User.findOne({ email, isDeleted: false });
      if (!user) {
        throw new AuthError('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new AuthError('Invalid credentials');
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '24h',
      });

      user.token = token;
      await user.save();

      return { user, token };
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown login error';
      throw new DatabaseError(`Login error: ${errorMessage}`);
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ValidationError('User not found');
      }

      user.token = '';
      await user.save();
      return true;
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown logout error';
      throw new DatabaseError(`Logout error: ${errorMessage}`);
    }
  }

  async validateToken(token: string): Promise<ITokenPayload | null> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as ITokenPayload;

      const user = await User.findOne({
        _id: decoded.userId,
        token,
        isDeleted: false,
        isActive: true,
      });

      if (!user) {
        return null;
      }

      return decoded;
    } catch (error: unknown) {
      return null;
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
  }

  async getUsersByApplication(
    application: ApplicationType,
    page = 1,
    limit = 50,
    sortField: keyof IUser = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<IPaginatedResponse> {
    try {
      const skip = (page - 1) * limit;
      const sort: Record<string, 1 | -1> = {
        [sortField]: sortOrder === 'asc' ? 1 : -1,
      };

      const [users, total] = await Promise.all([
        User.find({
          application,
          isDeleted: false,
        })
          .sort(sort)
          .skip(skip)
          .limit(limit),
        User.countDocuments({
          application,
          isDeleted: false,
        }),
      ]);

      return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      throw new DatabaseError(`Error fetching users: ${errorMessage}`);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const user = await User.findOne({
        _id: userId,
        isDeleted: false,
        isActive: true,
      });

      if (!user) {
        throw new ValidationError('User not found');
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        throw new AuthError('Current password is incorrect');
      }

      // Validate new password
      if (!newPassword || newPassword.length < 8) {
        throw new ValidationError('New password must be at least 8 characters long');
      }

      // Update password
      user.password = newPassword;
      user.token = ''; // Invalidate existing sessions
      await user.save();

      return true;
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown password change error';
      throw new DatabaseError(`Password change error: ${errorMessage}`);
    }
  }
}

// Export error classes for external use
export { AuthError, ValidationError, DatabaseError };

// Default export
export default AuthClient;
