import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import FormField from '@/components/FormField'
import { linkService } from '@/services/linkService'
import { createLinkSchema, updateLinkSchema } from '@/lib/validations'
import { getShortUrl } from '@/lib/format'

/*
* Form inside the dialog
*
* Dialog content is unmounted when closed, so the form always starts
* with fresh default values every time the dialog opens
* */
function LinkForm({ link, onSuccess }) {
  const isEdit = !!link

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEdit ? updateLinkSchema : createLinkSchema),
    defaultValues: isEdit
      ? { originalUrl: link.originalUrl }
      : { shortCode: '', originalUrl: '' },
  })

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await linkService.update(link.id, values)
        toast.success('Link updated')
      } else {
        await linkService.create(values)
        toast.success('Link created')
      }
      onSuccess()
    } catch (error) {
      // 409 = short code already used
      if (error.status === 409) {
        setError('shortCode', { message: 'Short code is already taken, try another one' })
        return
      }
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      {isEdit ? (
        <FormField
          id="shortCode"
          label="Short code"
          value={link.shortCode}
          description={`${getShortUrl(link.shortCode)} (cannot be changed)`}
          disabled
        />
      ) : (
        <FormField
          id="shortCode"
          label="Short code"
          placeholder="promo-2026"
          autoComplete="off"
          description="4-20 characters: lowercase letters, numbers, - or _."
          error={errors.shortCode}
          {...register('shortCode')}
        />
      )}

      <FormField
        id="originalUrl"
        label="Destination URL"
        type="url"
        placeholder="https://example.com/a-very-long-page"
        autoComplete="off"
        error={errors.originalUrl}
        {...register('originalUrl')}
      />

      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Save' : 'Create link'}
        </Button>
      </DialogFooter>
    </form>
  )
}

/*
* Link Form Dialog
*
* link = null   → create mode
* link = object → edit mode (only originalUrl can be changed)
* */
function LinkFormDialog({ open, onOpenChange, link, onSuccess }) {
  const isEdit = !!link

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit link' : 'Create short link'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Change the destination URL of this short link.' : 'Choose a short code and its destination URL.'}
          </DialogDescription>
        </DialogHeader>
        <LinkForm link={link} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  )
}

export default LinkFormDialog
