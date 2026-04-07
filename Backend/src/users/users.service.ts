import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string, withPassword = false) {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (withPassword) {
      query.select('+password');
    }
    return query.exec();
  }

  async createUser(payload: { name: string; email: string; password: string }) {
    const user = new this.userModel({
      ...payload,
      email: payload.email.toLowerCase(),
    });
    return user.save();
  }

  async findById(userId: string, withPassword = false) {
    const query = this.userModel.findById(userId);
    if (withPassword) {
      query.select('+password');
    }
    return query.exec();
  }

  async updatePassword(userId: string, password: string) {
    return this.userModel
      .findByIdAndUpdate(userId, { password }, { new: true })
      .exec();
  }
}
