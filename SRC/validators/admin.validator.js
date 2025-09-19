import { z } from 'zod';

export const signUpValidator = z.object ({
    name: z.string(),
    password: z
        .string()
        .min(8,{message: 'Password should not be less than 8 characters long'})
        .max(12,{message: 'Password should not exceed 12 characters'})
        .regex(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[!@#$%^&])[A-Za-z\d!@#$%^&]+$/, {
            message: 'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          }),
    confirmPassword: z.string(),
    email: z.string().min(3).max(30),
    phoneNumber: z.string().min(10, {message: 'Phone number should be at least 10 digits'}).max(11, {message: 'Phone number should not exceed 11 digits'}),
    occupation: z.string().min(1, {message: 'Occupation is required'}),
    gender: z.enum(['Male', 'Female', 'male', 'female'], {message: 'Gender must be Male, Female, male, or female'})
}).required({message: 'Please enter all the required fields'})

export const logInValidator = z.object ({
    email: z.string(),
    password: z.string().min(8).max(12),
}).required({message: 'please enter all the required fields'})

