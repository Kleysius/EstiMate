const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: 'avatars/unknown.svg'
    },
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z-' ]+$/.test(v);
            },
            message: props => `${props.value} n'est pas un nom valide! Seuls les caractères alphanumériques, les espaces, les tirets et les apostrophes sont autorisés.`
        },
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z-' ]+$/.test(v);
            },
            message: props => `${props.value} n'est pas un prénom valide! Seuls les caractères alphanumériques, les espaces, les tirets et les apostrophes sont autorisés.`
        },
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Cet email est déjà utilisé.'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: props => `${props.value} n'est pas une adresse email valide!`
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
            },
            message: 'Le mot de passe doit contenir au moins 8 caractères, dont au moins un chiffre, une minuscule et une majuscule.'
        },
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v === this.password;
            },
            message: 'Les mots de passe ne correspondent pas. Veuillez réessayer.'
        }
    }
});

// Pre-save hook for password encryption and entity validation
userSchema.pre('save', async function (next) {
    try {
        const error = this.validateSync();
        if (error) {
            next(error);
        } else {
            if (this.isModified('password') || this.isNew) {
                const salt = await bcrypt.genSalt(10);
                this.password = await bcrypt.hash(this.password, salt);
                this.confirmPassword = undefined;
            }
            next();
        }
    } catch (error) {
        next(error);
    }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;