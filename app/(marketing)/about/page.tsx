/* eslint-disable react/no-unescaped-entities */
import { DancingScript, fontSans } from "@/utility/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Buy Me Zobo",
  description: "Learn more about Buy Me Zobo, our features, and our goal",
};

const AboutPage = () => {
  return (
    <section className="mt-4 md:mt-16 lg:mt-20 px-4 flex flex-col justify-center mx-auto md:max-w-3xl pb-12">
      <div className="text-center">
        <h1
          className={`${DancingScript.className} text-4xl md:text-5xl font-bold`}
        >
          Our Gist
        </h1>
      </div>
      <div className={`${fontSans}text-sm xl:text-xl font-semibold leading-7`}>
        <p className="mt-6 mb-10">
          We're firm believers that every Nigerian has a creator within them.
          Our mission is to support as many Nigerian creators in unlocking their
          full potential and effortlessly earning from their creativity.
        </p>
        <p>
          <span className="text-4xl">"Here's the gist:</span> Our Goal? Ditch
          the stress, simplify "appreciations", and foster genuine connections
          between creators and their fans. But guess what? Simple just won't cut
          it. Creators craved something more than just ease-of-use; a platform
          that resonated with meaning and sparked joy. And so, we set out to
          design a payment experience that goes beyond mere transactions."
        </p>
        <p className="mt-6">
          Ever heard the joke about the Nigerian creator who walked into a bar?
          Neither have we, because they were too busy crafting their next
          masterpiece! At our core, we're all about turning creativity into
          cash, so you can say goodbye to those days of relying on ads that
          vanish quicker than NEPA power. With Buy Me a Coffee... oops, I mean
          Buy Me Zobo, Nigerian creators can finally sip on success, one
          grateful fan at a time. It's time to turn those creative sparks into
          Naira bills, because why settle for just dreams when you can have your
          own fan-funded reality show? Let's paint the town green, white, green
          with creativity, one sip at a time!
        </p>
      </div>
      <div className="flex mt-8">
        <p
          className={`text-2xl lg:text-3xl tracking-tighter italic select-none ${fontSans.className}`}
        >
          BMZteam
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
