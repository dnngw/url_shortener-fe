import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/*
* Form Field
*
* Label + input + error message. Spread register('name') from react-hook-form to the props
* */
function FormField({ id, label, error, description, ...inputProps }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...inputProps} />
      {error ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}

export default FormField
