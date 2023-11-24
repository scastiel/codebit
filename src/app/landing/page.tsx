'use client'
import PlansTable from '@/app/my/plan/plans-table'
import { NewLandingPlayer } from '@/app/new-landing-player'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function LandingPage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 border-b bg-slate-950 bg-opacity-50 backdrop-blur-sm z-10">
        <UserMenu user={null} planId={null} />
      </header>
      <main className="w-full flex-1 max-w-screen-xl flex flex-col mx-auto">
        {/* HERO SECTION */}
        <section className="min-h-[100dvh] w-full py-32 flex flex-col md:grid md:grid-cols-2 gap-8 p-4 justify-center md:items-center">
          <div className="flex flex-col md:gap-6 justify-center items-start">
            <div className="text-[2.5rem] lg:text-[3.5rem] xl:text-[4rem] text-balance leading-none font-bold bg-gradient-to-b drop-shadow from-slate-100 to-slate-400 bg-clip-text text-transparent py-4">
              Tell a story with your code
            </div>
            <div className="text-[1.5rem] text-slate-500 text-balance mb-4">
              And boost engagement with your community
            </div>
            <Button size="lg" asChild>
              <Link href="/my">Create my code video</Link>
            </Button>
          </div>
          <div>
            <NewLandingPlayer />
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="min-h-[100dvh] py-16 flex flex-col items-stretch gap-6">
          <h2 className="text-center text-balance text-[1.5rem] md:text-[2.5rem] font-bold max-w-screen-md self-center leading-none bg-gradient-to-b drop-shadow from-slate-100 to-slate-400 bg-clip-text text-transparent py-4">
            Just a few steps to create your animated code video
          </h2>
          <div className="flex flex-col justify-center md:grid md:grid-cols-2 gap-8 md:gap-4 p-4 items-center">
            <div className="flex items-center justify-center md:justify-start">
              <ul
                role="list"
                className="flex flex-col gap-6 text-[1.1rem] lg:text-[1.5rem]"
              >
                <NumberedListItem
                  index={1}
                  title={<>Type your code sequences in the editor</>}
                  description={<>No new syntax to learn, it’s Markdown!</>}
                />
                <NumberedListItem
                  index={2}
                  title={<>Customize the colors and fonts</>}
                  description={<>Make your video look like you!</>}
                />
                <NumberedListItem
                  index={3}
                  title={<>Export your creation as a video</>}
                  description={<>Get your video as an MP4 file.</>}
                />
                <NumberedListItem
                  index={4}
                  title={<>Share it with your community</>}
                  description={<>Code videos generate high engagement!</>}
                />
              </ul>
            </div>
            <div>
              <Image
                src={require('../../../public/editor-screenshot.png')}
                alt="Editor screenshot"
              />
              <div className="flex justify-center">
                <Button size="lg" asChild>
                  <Link href="/my">Start for free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="min-h-[100dvh] py-16 flex flex-col justify-center items-stretch">
          <h2 className="text-center text-balance text-[1.5rem] md:text-[2.5rem] font-bold max-w-screen-md self-center leading-none bg-gradient-to-b drop-shadow from-slate-100 to-slate-400 bg-clip-text text-transparent py-4">
            A fair pricing for everyone
          </h2>
          <div className="text-center text-slate-400 text-[1.1rem] text-balance">
            Whether you create content for fun or profit, we have the right
            offer for you!
          </div>
          <div className="mt-16 mb-16 px-4 max-w-screen-lg w-full mx-auto">
            <PlansTable />
          </div>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/my">Start for free</Link>
            </Button>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="min-h-[100dvh] py-16 flex flex-col justify-center items-stretch gap-8">
          <h2 className="text-center text-balance text-[1.5rem] md:text-[2.5rem] font-bold max-w-screen-md self-center leading-none bg-gradient-to-b drop-shadow from-slate-100 to-slate-400 bg-clip-text text-transparent py-4">
            Frequently asked questions
          </h2>
          <div className="px-4 flex flex-col gap-4 max-w-screen-md mx-auto w-full">
            <Accordion type="multiple">
              <AccordionItem value="free-to-use">
                <AccordionTrigger className="text-left text-lg">
                  <span>
                    Is <strong>CodeBit</strong> free to use?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  You can start using CodeBit to generate your first videos for
                  free. Then, if you like the service, you can purchase a
                  subscription to unlock all features and generate more and
                  longer videos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="differences">
                <AccordionTrigger className="text-left text-lg">
                  <span>
                    What differentiates <strong>CodeBit</strong> from other
                    similar services?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  There aren’t many services that help developers create
                  animated code videos. We created CodeBit because we were
                  looking for features that we haven’t been able to find, such
                  as animating the code with a typing animation.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="export">
                <AccordionTrigger className="text-left text-lg">
                  <span>
                    How can I share the videos created with{' '}
                    <strong>CodeBit</strong>?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  You can export your animations as video files (MP4 for now,
                  more to come) and share them on social media. You can also
                  share a webpage displaying the animation, where visitors can
                  copy the code and paste it anywhere.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="other-questions">
                <AccordionTrigger className="text-left text-lg">
                  <span>
                    I have another question, or want to suggest a feature…
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  Feel free to contact us, either by email at{' '}
                  <a href="mailto:hello@codebit.xyz">hello@codebit.xyz</a> or{' '}
                  <a
                    href="https://twitter.com/scastiel"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    on Twitter
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/my">Start for free</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t bg-slate-950 bg-opacity-50 p-4 text-slate-400 text-sm text-center [&_a]:text-white">
        Made with ♥ in Montreal by{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://scastiel.dev"
        >
          @scastiel
        </a>{' '}
        and{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://maxday.dev">
          @maxday
        </a>
        .
      </footer>
    </>
  )
}

function NumberedListItem({
  index,
  title,
  description,
}: {
  index: number
  title: ReactNode
  description?: ReactNode
}) {
  return (
    <li className="flex items-baseline gap-4">
      <div className="flex-shrink w-[1.5em] h-[1.5em] flex items-center justify-center bg-slate-300 text-slate-800 rounded-full text-[0.8em] font-bold">
        {index}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div>{title}</div>
        {description && (
          <p className="text-[0.75em] text-slate-400">{description}</p>
        )}
      </div>
    </li>
  )
}
