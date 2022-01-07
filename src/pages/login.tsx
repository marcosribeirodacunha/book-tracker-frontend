import Link from "next/link";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { loginResolver } from "resolvers/login";
import { withSSRGuest } from "utils/withSSRGuest";
import { useAuth } from "context/AuthContext";

import { Button } from "components/Button";
import { Input } from "components/Input";

import styles from 'styles/auth.module.scss'

interface IFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IFormData>({ resolver: loginResolver })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signIn(data);
    } catch (error: any) {
      if (error.response) {
        const message = (error as AxiosError).response?.data.message
        toast.error(message)
      }
    }
  })

  return (
    <section className={styles.container}>
      <h1>Welcome back to the <br />Book Tracker</h1>

      <form onSubmit={onSubmit}>
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
          Login
        </Button>

        <Link href="/signup">
          <a className={styles.link}>Sign Up</a>
        </Link>
      </form>
    </section>
  )
}

export const getServerSideProps = withSSRGuest(async () => ({ props: {} }))
