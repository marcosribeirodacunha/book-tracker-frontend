import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

export const createBookResolver = yupResolver(
  yup.object().shape({
    title: yup.string().required().label('Title'),
    author: yup.string().required().label('Author'),
  })
)