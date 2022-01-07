import { useEffect, useState } from "react";
import { api } from "services/apiClient";

interface IUseFetchProps<Data, Error> {
  url: string;
}

export function useFetch<Data = any, Error = any>({ url }: IUseFetchProps<Data, Error>) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [data, setData] = useState<Data>()

  useEffect(() => {

  }, [])
}