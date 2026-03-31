import { getLiveGoogleReviews } from "@/lib/reviews";
import styles from "./GoogleReviews.module.css";
import Image from "next/image";
import { Star } from "lucide-react";

export default async function GoogleReviews() {
    const data = await getLiveGoogleReviews();

    // Limit to 3 for the homepage grid
    const topReviews = data.reviews.slice(0, 3);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.metaBadge}>
                        <span className={styles.gLogo}>G</span>
                        <div className={styles.metaData}>
                            <div className={styles.starsWrapper}>
                                {data.rating} <Star size={14} fill="currentColor" stroke="none" />
                            </div>
                            <span className={styles.totalReviews}>Based on {data.user_ratings_total} reviews</span>
                        </div>
                    </div>
                    <h2>Guest Experiences</h2>
                    <p>Discover what our guests love about their stay at Hotel New Ganga.</p>
                </div>

                <div className={styles.reviewsGrid}>
                    {topReviews.map((review, i) => (
                        <div key={i} className={styles.reviewCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}>
                                    <Image 
                                        src={review.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=0f172a&color=fff`} 
                                        alt={`${review.author_name} - 5 Star Guest Review for Hotel New Ganga Guwahati`}
                                        width={48} 
                                        height={48}
                                        className={styles.avatarImg}
                                        unoptimized // Avoids Next.js image optimization errors from random user avatar URLs
                                    />
                                </div>
                                <div className={styles.authorInfo}>
                                    <h4>{review.author_name}</h4>
                                    <span>{review.relative_time_description}</span>
                                </div>
                                <div className={styles.cardRating}>
                                    {Array.from({ length: review.rating }).map((_, j) => (
                                        <Star key={j} size={14} fill="currentColor" stroke="none" className={styles.starIcon} />
                                    ))}
                                </div>
                            </div>
                            <p className={styles.reviewText}>
                                &quot;{review.text.length > 180 ? review.text.substring(0, 180) + "..." : review.text}&quot;
                            </p>
                            <a href={review.author_url !== "#" ? review.author_url : `https://www.google.com/maps/search/?api=1&query=Hotel+New+Ganga+Guwahati`} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className={styles.readMore}>
                                Read on Google
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
