'use client'
import PlansTable from '@/app/my/plan/plans-table'
import { NewLandingPlayer } from '@/app/new-landing-player'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'
import Image from 'next/image'
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
          <div className="flex flex-col gap-6 justify-center items-start">
            <div className="text-[2.5rem] lg:text-[3.5rem] xl:text-[4rem] text-balance leading-none font-bold bg-gradient-to-b drop-shadow from-slate-100 to-slate-400 bg-clip-text text-transparent py-4">
              Tell a story with your code
            </div>
            <Button size="lg">Start for free</Button>
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
                  title={<>Type your code in our editor</>}
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
                  description={<>Get an MP4 video in high-definition!</>}
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
                <Button size="lg">Start for free</Button>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="min-h-[100dvh] py-16 flex flex-col justify-center items-stretch gap-8">
          <h2 className="text-center text-balance text-[1.5rem] md:text-[2.5rem] font-bold max-w-screen-md self-center leading-none bg-gradient-to-b drop-shadow from-slate-100 to-slate-400 bg-clip-text text-transparent py-4">
            A fair pricing for everyone
          </h2>
          <div className="px-4 max-w-screen-lg w-full mx-auto">
            <PlansTable />
          </div>
          <div className="flex justify-center">
            <Button size="lg">Start for free</Button>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="min-h-[100dvh] py-16 flex flex-col justify-center items-stretch gap-8">
          <h2 className="text-center text-balance text-[1.5rem] md:text-[2.5rem] font-bold max-w-screen-md self-center leading-none bg-gradient-to-b drop-shadow from-slate-100 to-slate-400 bg-clip-text text-transparent py-4">
            Frequently asked questions
          </h2>
          <div className="px-4 flex flex-col gap-4 max-w-screen-md mx-auto w-full">
            <details>
              <summary>Question #1</summary>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et
                aspernatur excepturi, reiciendis exercitationem beatae
                dignissimos, vero error corporis ex, cumque cum aut id expedita
                illo dolorum quos architecto tenetur eum?
              </p>
            </details>
            <details>
              <summary>Question #2</summary>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et
                aspernatur excepturi, reiciendis exercitationem beatae
                dignissimos, vero error corporis ex, cumque cum aut id expedita
                illo dolorum quos architecto tenetur eum?
              </p>
            </details>
            <details>
              <summary>Question #3</summary>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et
                aspernatur excepturi, reiciendis exercitationem beatae
                dignissimos, vero error corporis ex, cumque cum aut id expedita
                illo dolorum quos architecto tenetur eum?
              </p>
            </details>
            <details>
              <summary>Question #4</summary>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et
                aspernatur excepturi, reiciendis exercitationem beatae
                dignissimos, vero error corporis ex, cumque cum aut id expedita
                illo dolorum quos architecto tenetur eum?
              </p>
            </details>
          </div>
          <div className="flex justify-center">
            <Button size="lg">Start for free</Button>
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
