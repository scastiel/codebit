'use client'
import { formSchema } from '@/components/feedback-button/feedback-button-common'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

type Props = {
  sendFeedback: (values: z.infer<typeof formSchema>) => Promise<void>
}

export function FeedbackButtonClient({ sendFeedback }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  })
  const [dialogKey, setDialogKey] = useState(0)
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await sendFeedback(values)
    setDialogKey((k) => k + 1)
    toast({
      title: 'Thank you for your feedback!',
      description:
        'We will have a look at it as soon as possible, and will get back to you if needed.',
    })
  }

  const isSubmitting = form.formState.isSubmitting
  return (
    <div className="fixed right-4 bottom-4">
      <Dialog key={dialogKey}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" /> Feedback
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>Give us your feedback!</DialogTitle>
                <DialogDescription>
                  We are always working to improve the user experience, and your
                  feedback helps us a lot.
                </DialogDescription>
              </DialogHeader>
              <div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Your feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your feedback"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{' '}
                      Submitting…
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
