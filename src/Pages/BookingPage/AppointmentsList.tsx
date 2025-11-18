import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentCard from "./AppointmentCard";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

interface Appointment {
    id: number;
    date: string;
    status: "upcoming" | "completed" | "canceled";
    doctorName: string;
    specialization: string;
    doctorImage?: string;
    location: string;
    doctorId: number;

}

interface AppointmentsListProps {
    tab: string;
    date: Date | null;

}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ tab, date }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelId, setCancelId] = useState<number | null>(null);
    console.log(error)
    const token = Cookies.get("accessToken");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    "https://cure-doctor-booking.runasp.net/api/Customer/Booking/PatientBookings",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "*/*",
                        },
                    }
                );

                const rawData = response.data?.data?.data;
                console.log(rawData)

                if (Array.isArray(rawData)) {
                    const mappedAppointments: Appointment[] = rawData.map(
                        (item: any) => ({
                            id: item.id,
                            doctorId: item.doctorId,
                            date: item.appointmentAt,
                            status: item.status?.toLowerCase(),
                            doctorName: item.doctorName,
                            specialization: item.doctorSpeciality,
                            doctorImage: item.doctorImg
                                ? `https://cure-doctor-booking.runasp.net/${item.doctorImg}`
                                : undefined,
                            location: "Cairo Medical Center",
                        })
                    );

                    setAppointments(mappedAppointments);
                } else {
                    setAppointments([]);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load appointments");
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const filteredAppointments =
        tab === "All"
            ? appointments
            : appointments.filter(
                (a) => a.status === tab.toLowerCase()
            );

    const finalAppointments = date
        ? filteredAppointments.filter(
            (a) =>
                new Date(a.date).toDateString() ===
                date.toDateString()
        )
        : filteredAppointments;

    const handleConfirmCancel = () => {
        if (cancelId === null) return;

        setAppointments((prev) =>
            prev.map((app) =>
                app.id === cancelId
                    ? { ...app, status: "canceled" }
                    : app
            )
        );

        setCancelId(null);
    };

    if (loading)
        return (
            <p className="text-center text-gray-500">
                Loading appointments...
            </p>
        );

    return (
        <>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {finalAppointments.length > 0 ? (
                    finalAppointments.map((a) => (
                        <AppointmentCard
                            key={a.id}
                            appointment={a}
                            onCancel={setCancelId}
                        />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-blue-100 to-gray-50 shadow-lg hover:scale-105 transition-transform duration-300">
                        <img
                            src="https://img.icons8.com/fluency/96/null/calendar--v1.png"
                            alt="No appointments"
                            className="mb-4"
                        />
                        <h3 className="text-xl font-semibold text-[#145DB8] mb-2">
                            No Appointments Yet
                        </h3>
                        <p className="text-gray-600 mb-4 text-center">
                            You haven't scheduled any appointments.
                            Start by booking your first visit!
                        </p>
                        <Link
                            to="/bookappointment"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Book Now
                        </Link>
                    </div>
                )}
            </div>

            {cancelId !== null && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px] text-center">
                        <h3 className="text-xl font-semibold text-[#145DB8] mb-3">
                            Are you sure?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Do you really want to cancel this appointment?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelId(null)}
                                className="flex-1 py-2 border border-gray-400 rounded-lg text-gray-600"
                            >
                                No
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppointmentsList;
