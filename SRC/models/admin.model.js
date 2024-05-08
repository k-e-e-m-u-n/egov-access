import mongoose from 'mongoose'


const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: '',
    },
    bio: {
        type: String
    },
    followers: {
        type: [String],
        default: []
    },
},
{timestamps : true}
)

const Admin = mongoose.model('Admin',adminSchema)

export default Admin