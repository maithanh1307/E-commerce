import { Heart, Sparkles } from 'lucide-react';
import aboutImage from '../../../assets/about.jpg';

const CONTENT = {
    title: 'Hi, welcome to our little shop!',
    paragraphs: [
        'We started as two friends who could never find cute things we actually wanted to use, so we decided to make our own shop.',
        'Every item is picked with care, packed by hand and sent out with a small surprise inside. We hope it brings a little smile to your day.',
    ],
    cta: { label: 'Explore the shop', href: '/products' },
    badge: 'Made with love',
};

export default function AboutMe() {
    return (
        <section className="about" aria-labelledby="about-title">
            <div className="about__text">
                <Sparkles className="about__sparkle" size={22} aria-hidden />

                <h2 id="about-title">{CONTENT.title}</h2>

                {CONTENT.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                ))}

                <a className="about__cta" href={CONTENT.cta.href}>
                    {CONTENT.cta.label}
                </a>
            </div>

            <figure className="about__media">
                <img src={aboutImage} alt="Our shop and team" />

                <figcaption className="about__badge">
                    <Heart size={16} fill="currentColor" aria-hidden />
                    {CONTENT.badge}
                </figcaption>
            </figure>
        </section>
    );
}