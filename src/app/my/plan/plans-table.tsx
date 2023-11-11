import { cancel, changePlan, subscribe, uncancel } from '@/app/my/plan/actions'
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plan, plans } from '@/lib/plans'
import { delay } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ImprovedButton } from './improved-button'

type Props = {
  currentPlan: Plan
  subscriptionId: string | null
  subscriptionEndDate: Date | null
  refresh: () => void
  initialInterval: 'month' | 'year' | null
}

export default function PlansTable({
  currentPlan,
  subscriptionId,
  subscriptionEndDate,
  refresh,
  initialInterval,
}: Props) {
  return (
    <>
      <Tabs defaultValue={initialInterval ?? 'year'} className="mt-12">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="year">
              Yearly{' '}
              <Badge variant="outline" className="ml-2 bg-pink-700 text-white">
                2 months free
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        {['month' as const, 'year' as const].map((interval) => (
          <TabsContent key={interval} value={interval}>
            <Table
              interval={interval}
              currentPlan={currentPlan}
              subscriptionId={subscriptionId}
              subscriptionEndDate={subscriptionEndDate}
              refresh={refresh}
              initialInterval={initialInterval}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

function Table({
  interval,
  currentPlan,
  subscriptionId,
  subscriptionEndDate,
  refresh,
  initialInterval,
}: {
  interval: 'month' | 'year'
  currentPlan: Plan
  subscriptionId: string | null
  subscriptionEndDate: Date | null
  refresh: () => void
  initialInterval: 'month' | 'year' | null
}) {
  return (
    <div className="mt-4 w-full grid gap-3 lg:gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="flex flex-col space-y-4 items-center border bg-black bg-opacity-50 rounded-lg p-4"
        >
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className="flex flex-col gap-2 items-center">
            <div className="font-bold text-4xl">
              $
              {interval === 'month'
                ? (plan.monthlyPriceCents / 100).toFixed(2)
                : (plan.yearlyPriceCents / 12 / 100).toFixed(2)}{' '}
              <small className="text-sm opacity-50">/ month</small>
            </div>
            {interval === 'year' && (
              <div className="opacity-50 text-sm">
                {plan.yearlyPriceCents > 0 ? (
                  <>
                    Billed as ${(plan.yearlyPriceCents / 100).toFixed(2)} / year
                  </>
                ) : (
                  <>&nbsp;</>
                )}
              </div>
            )}
          </div>
          <Separator />
          <ul className="flex flex-col space-y-2 text-sm [&_del]:opacity-50">
            <li className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <p>
                {plan.maxVideoDurationInSeconds < 60
                  ? `${plan.maxVideoDurationInSeconds}-second`
                  : `${plan.maxVideoDurationInSeconds / 60}-minute`}{' '}
                video
              </p>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <p>{plan.maxVideoRenders} video renders / month</p>
            </li>
            <li className="flex items-center space-x-2">
              {plan.watermark ? (
                <>
                  <X className="w-5 h-5 text-red-600" />
                  <p>
                    <del>No watermark</del>
                  </p>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 text-green-600" />{' '}
                  <p>No watermark</p>
                </>
              )}
            </li>
            <li className="flex items-center space-x-2">
              {plan.prioritySupport ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />{' '}
                  <p>Priority support</p>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-600" />
                  <p>
                    <del>Priority support</del>
                  </p>
                </>
              )}
            </li>
          </ul>
          <Separator />
          <div className="flex flex-col items-center text-center flex-1 justify-center gap-2">
            <PlanButtons
              plan={plan}
              isCurrentPlan={
                plan.id === currentPlan.id && initialInterval === interval
              }
              subscriptionId={subscriptionId}
              subscriptionEndDate={subscriptionEndDate}
              refresh={refresh}
              interval={interval}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function PlanButtons({
  plan,
  isCurrentPlan,
  subscriptionId,
  subscriptionEndDate,
  refresh,
  interval,
}: {
  plan: Plan
  isCurrentPlan: boolean
  subscriptionId: string | null
  subscriptionEndDate: Date | null
  refresh: () => void
  interval: 'month' | 'year'
}) {
  const router = useRouter()

  return (
    <>
      {isCurrentPlan ? (
        <>
          <Badge variant="outline" className="bg-pink-700 text-white mt-2">
            Current plan
          </Badge>
          {subscriptionId && subscriptionEndDate ? (
            <>
              <small>
                Ends on{' '}
                {new Date(subscriptionEndDate).toLocaleDateString('en-US', {
                  dateStyle: 'long',
                })}
                .
              </small>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-pink-600">
                    Resubscribe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Resubscribe</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reactivate your subscription?
                    </DialogDescription>
                  </DialogHeader>
                  <p>
                    Your subscription will continue after the end of the current
                    billing period, and you will keep access to the plan’s
                    features.
                  </p>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <ImprovedButton
                      action={async () => {
                        await uncancel()
                        await delay(2000)
                        refresh()
                      }}
                    >
                      Resubscribe
                    </ImprovedButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            subscriptionId && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-pink-600">
                    Cancel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel subscription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription?
                    </DialogDescription>
                  </DialogHeader>
                  <p>
                    By cancelling your subscription, you won’t have access to
                    the plan’s features after the end of your current billing
                    period.
                  </p>
                  <DialogFooter>
                    <ImprovedButton
                      action={async () => {
                        await cancel()
                        await delay(2000)
                        refresh()
                      }}
                    >
                      Cancel subscription
                    </ImprovedButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )
          )}
        </>
      ) : (
        plan.monthlyPriceCents > 0 &&
        (subscriptionId ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Change to this plan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Subscribe to plan <strong>{plan.name}</strong>
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to change your subscription?
                </DialogDescription>
              </DialogHeader>
              <p>
                Your subscription will change immediately, and you will be
                billed accordingly, depending on how many days remain in the
                current billing period.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <ImprovedButton
                  action={async () => {
                    await changePlan(plan.id, interval)
                    await delay(2000)
                    refresh()
                  }}
                >
                  Change subscription
                </ImprovedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Subscribe</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Subscribe to plan <strong>{plan.name}</strong>
                </DialogTitle>
                <DialogDescription>
                  You will be charged $
                  {(
                    (interval === 'month'
                      ? plan.monthlyPriceCents
                      : plan.yearlyPriceCents) / 100
                  ).toFixed(2)}{' '}
                  immediately for the first billing period.
                </DialogDescription>
              </DialogHeader>
              <p>
                We will redirected you to <strong>Stripe</strong> for payment.
                Taxes will be included in the next step.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <ImprovedButton
                  action={async () => {
                    const url = await subscribe(plan.id, interval)
                    router.push(url)
                    await delay(2000)
                  }}
                >
                  Subscribe
                </ImprovedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))
      )}
    </>
  )
}
