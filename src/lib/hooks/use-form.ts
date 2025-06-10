import { useState, useCallback } from "react"
import { z } from "zod"

interface UseFormOptions<T> {
  initialValues: T
  validationSchema?: z.ZodType<T>
  onSubmit: (values: T) => void | Promise<void>
}

interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
  })

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      if (!validationSchema) return ""

      try {
        validationSchema.parse({ ...state.values, [name]: value })
        return ""
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find((err) => err.path[0] === name)
          return fieldError?.message || ""
        }
        return ""
      }
    },
    [validationSchema, state.values]
  )

  const validateForm = useCallback(() => {
    if (!validationSchema) return true

    try {
      validationSchema.parse(state.values)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof T, string>> = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T
          errors[field] = err.message
        })
        setState((prev) => ({ ...prev, errors }))
      }
      return false
    }
  }, [validationSchema, state.values])

  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
        errors: { ...prev.errors, [name]: validateField(name, value) },
        touched: { ...prev.touched, [name]: true },
      }))
    },
    [validateField]
  )

  const handleBlur = useCallback(
    (name: keyof T) => {
      setState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [name]: true },
        errors: {
          ...prev.errors,
          [name]: validateField(name, prev.values[name]),
        },
      }))
    },
    [validateField]
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setState((prev) => ({ ...prev, isSubmitting: true }))

      const isValid = validateForm()
      if (!isValid) {
        setState((prev) => ({ ...prev, isSubmitting: false }))
        return
      }

      try {
        await onSubmit(state.values)
        setState((prev) => ({ ...prev, isSubmitting: false }))
      } catch (error) {
        setState((prev) => ({ ...prev, isSubmitting: false }))
        throw error
      }
    },
    [onSubmit, state.values, validateForm]
  )

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
    })
  }, [initialValues])

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setState
  }
} 