import {sequelize} from '../db/connection';
import {genSaltSync, hashSync, compareSync} from 'bcrypt';

import {
    Sequelize,
    Model,
    DataTypes,
    Optional,
    BOOLEAN,
    DATEONLY,
    STRING,
  } from "sequelize";

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    name: string | null | undefined;
    baby_birth_date: Date | null | undefined;
    onboarding_done: boolean;
    accepted_privacy_policy: boolean;
    accepted_terms_and_conditions: boolean;
};

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {};

export default class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public name: string | null | undefined;
    public baby_birth_date: Date | null | undefined;
    public onboarding_done!: boolean;
    public accepted_privacy_policy!: boolean;
    public accepted_terms_and_conditions!: boolean;

    public validPassword = (password: string): boolean => {
        return compareSync(password, this.password);
    };
};

User.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: STRING,
        allowNull: false,
      },
      name: {
        type: STRING,
        allowNull: true,
      },
      baby_birth_date: {
        type: DATEONLY,
        allowNull: true,
      },
      onboarding_done: {
        type: BOOLEAN,
        defaultValue: false,
      },
      accepted_privacy_policy: {
        type: BOOLEAN,
        defaultValue: false,
      },
      accepted_terms_and_conditions: {
        type: BOOLEAN,
        defaultValue: false,
      },
}, {
    sequelize: <Sequelize>sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: (user: User) => {
            const salt = genSaltSync();
            user.password = hashSync(user.password, salt);
        },
    },
});

User.sync();