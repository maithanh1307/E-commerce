import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import banner1 from '../../../assets/banner-1.png';
import banner2 from '../../../assets/banner-2.png';
import banner3 from '../../../assets/banner-3.png';

const SLIDES = [banner1, banner2, banner3];
const AUTOPLAY_MS = 5000;

export default function HeroBanner() {
    const [slide, setSlide] = useState(0);
    const [paused, setPaused] = useState(false);
    const total = SLIDES.length;

    const previousSlide = () => setSlide((current) => (current + total - 1) % total);
    const nextSlide = () => setSlide((current) => (current + 1) % total);

    // auto slide
    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (paused || reduceMotion) return;

        const id = window.setInterval(nextSlide, AUTOPLAY_MS);
        return () => window.clearInterval(id);
    }, [paused, slide]); 
    return (
        <section
            className="hero"
            aria-roledescription="carousel"
            aria-label="Featured banners"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            {SLIDES.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt={`Banner ${index + 1}`}
                    className={`hero__slide ${index === slide ? 'is-active' : ''}`}
                    aria-hidden={index !== slide}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    draggable={false}
                />
            ))}

            <button className="hero__arrow hero__arrow--prev" onClick={previousSlide} aria-label="Previous slide">
                <ChevronLeft size={26} />
            </button>
            <button className="hero__arrow hero__arrow--next" onClick={nextSlide} aria-label="Next slide">
                <ChevronRight size={26} />
            </button>

            <div className="hero__dots">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        className={index === slide ? 'is-active' : ''}
                        onClick={() => setSlide(index)}
                        aria-label={`Slide ${index + 1}`}
                        aria-current={index === slide}
                    />
                ))}
            </div>
        </section>
    );
}