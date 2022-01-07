import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

export const signUpResolver = yupResolver(
  yup.object().shape({
    name: yup.string().required().label('Name'),
    email: yup.string().email().required().label('E-mail'),
    password: yup.string().required().label('Password'),
  })
)