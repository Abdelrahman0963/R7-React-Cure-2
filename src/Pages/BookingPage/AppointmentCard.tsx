import ReschedulePopup from "@/components/ReschedulePopup/ReschedulePopup";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";

interface AppointmentProps {
  appointment: {
    id: number;
    doctorId: number;
    date: string;
    status: string;
    doctorName: string;
    specialization: string;
    doctorImage?: string;
    location: string;
  };
  onCancel?: (id: number) => void;
}

const AppointmentCard: React.FC<AppointmentProps> = ({ appointment }) => {
  const navigate = useNavigate();
  const { date, status: rawStatus, doctorId, doctorName, specialization, doctorImage, location } = appointment;
  const [showReschedulePopup, setShowReschedulePopup] = React.useState(false);

  const handleReschedule = () => {
    setShowReschedulePopup(true);
  };
  // نعمل normalization للحالة (lowercase, trim)
  const statusKey = String(rawStatus ?? "").trim().toLowerCase();

  // خريطة الحالات المعروفة + دعم لبدائل شائعة (cancelled vs canceled)
  const statusStyles: Record<string, { text: string; color: string }> = {
    upcoming: { text: "Upcoming", color: "#145DB8" },
    completed: { text: "Completed", color: "#00A86B" },
    canceled: { text: "Canceled", color: "#D32F2F" },      // american
    cancelled: { text: "Canceled", color: "#D32F2F" },     // british spelling -> map to same
    // ممكن تضيف حالات إضافية هنا حسب الـ API: "pending", "no-show", ...
  };

  const fallback = { text: String(rawStatus ?? "Unknown").replace(/^\w/, (c) => c.toUpperCase()), color: "#6B7280" }; // grey
  const { text, color } = statusStyles[statusKey] ?? fallback;

  const handleBookAgain = () => {
    navigate(`/doctordetails/${doctorId}`);
  };

  const handleFeedback = () => {
    navigate(`/doctordetails/${doctorId}`);

  };

  const handleCancel = async () => {
    try {
      const token = Cookies.get("accessToken");

      await axios.put(
        `https://cure-doctor-booking.runasp.net/api/Customer/Booking/CancelBooking/${appointment.id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Appointment cancelled.");
      window.location.reload();

    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel appointment.");
    }
  };


  const renderButtons = () => {
    // نستخدم نفس statusKey هنا
    switch (statusKey) {
      case "upcoming":
        return (
          <>
            <button
              onClick={handleCancel}
              className="flex-1 border border-[#99A2AB] text-[#99A2AB] rounded-[10px] py-2 text-[14px] font-normal"
            >
              Cancel
            </button>

            <button
              onClick={handleReschedule}
              className="flex-1 bg-[#145DB8] text-white rounded-[10px] py-2 text-[14px] font-normal"
            >
              Reschedule
            </button>
          </>
        );

      case "completed":
        return (
          <>
            <button
              onClick={handleBookAgain}
              className="flex-1 border border-[#145DB8] text-[#145DB8] rounded-[10px] py-2 text-[14px] font-normal"
            >
              Book Again
            </button>
            <button
              onClick={handleFeedback}
              className="flex-1 bg-[#145DB8] text-white rounded-[10px] py-2 text-[14px] font-normal"
            >
              Feedback
            </button>
          </>
        );
      case "canceled":
      case "cancelled":
        return (
          <>
            <button
              onClick={handleBookAgain}
              className="flex-1 border border-[#145DB8] text-[#145DB8] rounded-[10px] py-2 text-[14px] font-normal"
            >
              Book Again
            </button>
            <button className="flex-1 bg-[#145DB8] text-white rounded-[10px] py-2 text-[14px] font-normal">
              Support
            </button>
          </>
        );
      default:
        // حالة غير معروفة — نعرض أزرار افتراضية أو لا شيء
        return null;
    }
  };

  return (
    <div className="w-full max-w-sm border border-[#BBC1C7] rounded-[20px] flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[12px] text-[#05162C]">
            {new Date(date).toLocaleString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <span className="text-[14px] font-medium" style={{ color }}>
          {text}
        </span>
      </div>

      <div className="border-t border-[#BBC1C7]" />

      <div className="flex items-center gap-3">
        <div className="w-[45px] h-[45px] rounded-full bg-[#D9D9D9] overflow-hidden">
          {doctorImage && <img src={doctorImage} alt={doctorName} className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] text-[#33384B]">{doctorName}</span>
          <span className="text-[14px] text-[#6D7379]">{specialization}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[14px] text-[#6D7379]">{location}</span>
      </div>

      <div className="flex items-center gap-3 mt-2">{renderButtons()}</div>
      {showReschedulePopup && (
        <ReschedulePopup
          appointmentId={appointment.id}
          doctorId={doctorId}
          onClose={() => setShowReschedulePopup(false)}
        />
      )}

    </div>
  );
};

export default AppointmentCard;
