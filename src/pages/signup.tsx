import Link from "next/link";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { signUpResolver } from "resolvers/signup";
import { withSSRGuest } from "utils/withSSRGuest";

import { Button } from "components/Button";
import { Input } from "components/Input";

import styles from 'styles/auth.module.scss'
import { api } from "services/apiClient";
import Router from "next/router";

interface IFormData {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IFormData>({ resolver: signUpResolver })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await api.post('/users', data)
      Router.push('/login')
    } catch (error: any) {
      if (error.response) {
        const message = (error as AxiosError).response?.data.message
        toast.error(message)
      }
    }
  })

  return (
    <section className={styles.container}>
      <h1>Start today using the <br />Book Tracker</h1>

      <form onSubmit={onSubmit}>
        <Input
          label="Name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="E-mail"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Create account
        </Button>

        <Link href="/login">
          <a className={styles.link}>Login</a>
        </Link>
      </form>
    </section>
  )
}


export const getServerSideProps = withSSRGuest(async () => ({ props: {} }))