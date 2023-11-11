import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  // we will call User.build() instead of new User() in our app
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      // NOTE: these are built in vanilla JS types that are used by mongoose (nothing to do with TS)
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    // this will add a toJSON() function to every instance of a user. Whenever we do res.send(user), express automatically  
    // calls JSON.stringify(user) will run this logic to remove / modify properties
    toJSON: {
      transform(doc, ret) {
        // convert _id to id
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

// mongoose hook which gets executed before saving the document via user.save({ })
// NOTE:  we get our user object attached to "this", therefore we cant mark this callback as an arrow function!
userSchema.pre('save', async function (done) {
  // make sure to run this logic only if a different password is passed to save({ }), ignore changes to other properties
  if (this.isModified('password')) {
    // hash the password string that the user entered
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// add custom properties / methods onto the schema:
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
