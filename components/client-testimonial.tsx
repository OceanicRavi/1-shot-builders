import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play } from 'lucide-react';
type Testimonial = {
    id: number;
    author: string;
    position: string;
    quote: string;
    type: string;
    video_url?: string;
    project?: {
        name: string;
    };
    image?: string;
}

type TestimonialsSectionProps = {
    testimonials: Testimonial[];
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
    const [translateX, setTranslateX] = useState(0);
    const [isRotating, setIsRotating] = useState(true);

    // Calculate card width (320px card + 32px gap)
    const cardWidth = 352;
    const totalWidth = testimonials.length * cardWidth;
    // Auto-rotate functionality with smooth horizontal movement
    useEffect(() => {
        if (!isRotating || testimonials.length <= 3) return;

        const interval = setInterval(() => {
            setTranslateX((prev) => {
                const newTranslateX = prev - 1; // Move 1px at a time for smooth motion
                // Reset when we've scrolled past all items
                if (Math.abs(newTranslateX) >= totalWidth) {
                    return 0;
                }
                return newTranslateX;
            });
        }, 50); // Update every 50ms for smooth animation

        return () => clearInterval(interval);
    }, [isRotating, testimonials.length, totalWidth]);

    const handleMouseEnter = () => {
        setIsRotating(false);
    };

    const handleMouseLeave = () => {
        if (testimonials.length > 3) {
            setIsRotating(true);
        }
    };

    type VideoPlayerProps = {
        videoUrl: string;
        isDialog?: boolean;
    };

    const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, isDialog = false }) => {
        return (
            <div className={`relative ${isDialog ? 'w-full aspect-video' : 'w-full h-40'} bg-black rounded-lg overflow-hidden`}>
                <video
                    className="w-full h-full object-cover"
                    controls={isDialog}
                    poster=""
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {!isDialog && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-60 rounded-full p-3 cursor-pointer hover:bg-opacity-80 transition-all">
                            <Play className="h-6 w-6 text-white" />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    type TestimonialCardProps = {
        testimonial: Testimonial;
        keyPrefix?: string;
    };
    const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, keyPrefix = '' }) => (
        <Dialog key={`${keyPrefix}${testimonial.id || testimonial.author}`}>
            <DialogTrigger asChild>
                <Card className="w-80 flex-shrink-0 flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <CardHeader className="pb-4">
                        <div className="flex items-center mb-4">
                            <div className="relative h-12 w-12 mr-4">
                                <img
                                    src="https://images.pexels.com/photos/6898854/pexels-photo-6898854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt={testimonial.author}
                                    className="rounded-full object-cover w-full h-full"
                                />
                            </div>
                            <div>
                                <CardTitle className="text-base">{testimonial.author}</CardTitle>
                                <CardDescription>{testimonial.position}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-grow">
                        {testimonial.type === 'video' && testimonial.video_url && (
                            <div className="mb-4">
                                <VideoPlayer videoUrl={testimonial.video_url} />
                            </div>
                        )}

                        <p className="text-muted-foreground italic">
                            &ldquo;{testimonial.quote}&rdquo;
                        </p>
                    </CardContent>
                </Card>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">{testimonial.author}</DialogTitle>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src="https://images.pexels.com/photos/6898854/pexels-photo-6898854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"                            
                            alt={testimonial.author}
                            className="rounded-full object-cover w-16 h-16"
                        />
                        <div>
                            <h3 className="text-xl font-semibold">{testimonial.author}</h3>
                            <p className="text-muted-foreground">{testimonial.position}</p>
                        </div>
                    </div>

                    {testimonial.type === "video" && testimonial.video_url && (
                        <VideoPlayer videoUrl={testimonial.video_url} isDialog={true} />
                    )}

                    <blockquote className="text-lg italic border-l-4 border-primary pl-4">
                        &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                </div>
            </DialogContent>
        </Dialog>
    );

    // If 3 or fewer testimonials, show static grid (your original layout)
    if (testimonials.length <= 3) {
        return (
            <div className={`grid gap-8 ${testimonials.length === 1 ? 'justify-center' : 'grid-cols-1 md:grid-cols-3'}`}>
                {testimonials.map((testimonial, index) => (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center mb-4">
                                        <div className="relative h-12 w-12 mr-4">
                                            <img
                                                src="https://images.pexels.com/photos/6898854/pexels-photo-6898854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                alt={testimonial.author}
                                                className="rounded-full object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{testimonial.author}</CardTitle>
                                            <CardDescription>{testimonial.position}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    {testimonial.type === 'video' && testimonial.video_url && (
                                        <div className="mb-4">
                                            <VideoPlayer videoUrl={testimonial.video_url} />
                                        </div>
                                    )}
                                    <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                                </CardContent>
                            </Card>
                        </DialogTrigger>

                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogTitle className="sr-only">{testimonial.author}</DialogTitle>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src="https://images.pexels.com/photos/6898854/pexels-photo-6898854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                        alt={testimonial.author}
                                        className="rounded-full object-cover w-16 h-16"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold">{testimonial.author}</h3>
                                        <p className="text-muted-foreground">{testimonial.position}</p>
                                    </div>
                                </div>

                                {testimonial.type === 'video' && testimonial.video_url && (
                                    <VideoPlayer videoUrl={testimonial.video_url} isDialog={true} />
                                )}

                                <blockquote className="text-lg italic border-l-4 border-primary pl-4">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        );
    }

    // For more than 3 testimonials, show horizontal scrolling carousel
    return (
        <div>
            <div
                className="overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className="flex gap-8 transition-transform ease-linear"
                    style={{
                        transform: `translateX(${translateX}px)`,
                        width: `${totalWidth * 2}px` // Double width for seamless loop
                    }}
                >
                    {/* First set of testimonials */}
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={`first-${index}`} testimonial={testimonial} keyPrefix="first-" />
                    ))}

                    {/* Duplicate set for seamless loop */}
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={`second-${index}`} testimonial={testimonial} keyPrefix="second-" />
                    ))}
                </div>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={() => setIsRotating(!isRotating)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                    {isRotating ? 'Pause Rotation' : 'Resume Rotation'}
                </button>
            </div>
        </div>
    );
};

export default TestimonialsSection;