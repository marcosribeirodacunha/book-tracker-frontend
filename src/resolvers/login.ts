import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

export const loginResolver = yupResolver(
  yup.object().shape({
    email: yup.string().email().required().label('E-mail'),
    password: yup.string().required().label('Password'),
  })
)