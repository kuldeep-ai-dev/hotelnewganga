"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, BedDouble } from "lucide-react";
import styles from "./BookingWidget.module.css";
import { useRouter } from "next/navigation";

interface Room {
    id: string;
    name: string;
}

interface BookingWidgetProps {
    rooms: Room[];
}

export default function BookingWidget({ rooms }: BookingWidgetProps) {
    const router = useRouter();
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("1");
    const [roomId, setRoomId] = useState("");

    // Set initial room after mount to avoid SSR/client hydration mismatch
    useEffect(() => {
        if (rooms.length > 0) {
            setRoomId(rooms[0].id);
        }
    }, [rooms]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (roomId) params.set("room", roomId);
        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        router.push(`/book?${params.toString()}`);
    };

    return (
        <div className={styles.widgetWrapper}>
            <form className={styles.widget} onSubmit={handleSearch}>
                {/* Room Type */}
                <div className={styles.inputGroup}>
                    <label>Room Type</label>
                    <div className={styles.inputWrapper}>
                        <BedDouble size={18} className={styles.icon} />
                        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                            {rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))
                            ) : (
                                <>
                                    <option value="deluxe">Deluxe Room</option>
                                    <option value="superior">Superior Room</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.inputGroup}>
                    <label>Check In</label>
                    <div className={styles.inputWrapper}>
                        <Calendar size={18} className={styles.icon} />
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.inputGroup}>
                    <label>Check Out</label>
                    <div className={styles.inputWrapper}>
                        <Calendar size={18} className={styles.icon} />
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.inputGroup}>
                    <label>Guests</label>
                    <div className={styles.inputWrapper}>
                        <Users size={18} className={styles.icon} />
                        <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                            <option value="1">1 Adult</option>
                            <option value="2">2 Adults</option>
                            <option value="3">3 Adults</option>
                            <option value="4">Family (4)</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className={`btn btn-accent ${styles.searchBtn}`}>
                    Check Availability
                </button>
            </form>
        </div>
    );
}
