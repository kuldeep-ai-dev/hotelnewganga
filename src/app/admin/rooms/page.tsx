"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Check, Search, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

interface Room {
    id: string;
    name: string;
    description: string;
    image_url: string;
    amenities: string[];
    price_starting: number;
    is_featured: boolean;
    display_order: number;
}

export default function RoomsManagement() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image_url: "",
        amenities: [] as string[],
        price_starting: 0,
        is_featured: false,
        display_order: 0
    });
    const [newAmenity, setNewAmenity] = useState("");

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .order("display_order", { ascending: true });

        if (!error && data) {
            setRooms(data);
        }
        setLoading(false);
    };

    const handleOpenModal = (room?: Room) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                name: room.name,
                description: room.description || "",
                image_url: room.image_url || "",
                amenities: room.amenities || [],
                price_starting: room.price_starting || 0,
                is_featured: room.is_featured || false,
                display_order: room.display_order || 0
            });
        } else {
            setEditingRoom(null);
            setFormData({
                name: "",
                description: "",
                image_url: "",
                amenities: [],
                price_starting: 0,
                is_featured: false,
                display_order: rooms.length
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingRoom) {
            const { error } = await supabase
                .from("rooms")
                .update(formData)
                .eq("id", editingRoom.id);
            if (error) alert(error.message);
        } else {
            const { error } = await supabase
                .from("rooms")
                .insert([formData]);
            if (error) alert(error.message);
        }

        setIsModalOpen(false);
        fetchRooms();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this room?")) {
            const { error } = await supabase
                .from("rooms")
                .delete()
                .eq("id", id);
            if (error) alert(error.message);
            fetchRooms();
        }
    };

    const addAmenity = () => {
        if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
            setFormData({ ...formData, amenities: [...formData.amenities, newAmenity.trim()] });
            setNewAmenity("");
        }
    };

    const removeAmenity = (index: number) => {
        const updated = formData.amenities.filter((_, i) => i !== index);
        setFormData({ ...formData, amenities: updated });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Rooms Management</h1>
                <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Add Room Type
                </button>
            </div>

            {loading && !isModalOpen ? (
                <p>Loading rooms...</p>
            ) : (
                <div className={styles.grid}>
                    {rooms.map((room) => (
                        <div key={room.id} className={styles.roomCard}>
                            <img
                                src={room.image_url || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80"}
                                alt={room.name}
                                className={styles.roomImage}
                            />
                            <div className={styles.roomContent}>
                                <div className={styles.roomHeader}>
                                    <h3>{room.name}</h3>
                                    {room.is_featured && <span className={styles.featuredBadge}>Featured</span>}
                                </div>
                                <p className={styles.roomDesc}>{room.description}</p>
                                <div className={styles.roomFooter}>
                                    <span className={styles.price}>₹{room.price_starting} / Night</span>
                                    <div className={styles.actions}>
                                        <button className={`${styles.iconBtn} ${styles.editBtn}`} onClick={() => handleOpenModal(room)}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(room.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{editingRoom ? "Edit Room" : "Add New Room"}</h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Room Name</label>
                                <input
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Deluxe Room"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Description</label>
                                <textarea
                                    className={styles.textarea}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Room details..."
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Image URL</label>
                                <input
                                    className={styles.input}
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Starting Price (₹)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={formData.price_starting || ""}
                                    onChange={(e) => setFormData({ ...formData, price_starting: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Amenities</label>
                                <div className={styles.amenitiesInput}>
                                    <input
                                        className={styles.input}
                                        value={newAmenity}
                                        onChange={(e) => setNewAmenity(e.target.value)}
                                        placeholder="Add amenity (e.g. Free Wi-Fi)"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                                    />
                                    <button type="button" className={styles.addBtn} onClick={addAmenity}>Add</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {formData.amenities.map((amenity, idx) => (
                                        <span key={idx} className={styles.amenityTag}>
                                            {amenity}
                                            <X size={14} className={styles.removeAmenity} onClick={() => removeAmenity(idx)} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.checkboxGroup}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        />
                                        Featured on Website
                                    </label>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Display Order</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        style={{ width: '80px' }}
                                        value={formData.display_order || ""}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className={styles.saveBtn} disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
