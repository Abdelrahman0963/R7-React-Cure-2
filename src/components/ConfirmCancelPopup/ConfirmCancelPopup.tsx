import React from "react";

interface ConfirmProps {
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmCancelPopup: React.FC<ConfirmProps> = ({ onConfirm, onClose }) => {
    return (
        <div
            className="
      fixed inset-0 
      bg-black/30 
      backdrop-blur-sm
      flex items-center justify-center 
      z-50
    ">
            <div
                className="
        bg-white 
        rounded-[20px] 
        p-7 
        w-[300px] 
        shadow-[0_8px_25px_rgba(0,0,0,0.15)]
        transition-all 
        scale-100
      ">
                <h2 className="text-[19px] font-semibold text-[#05162C] text-center mb-5">Are you sure?</h2>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="
              flex-1 
              border border-[#99A2AB] 
              text-[#99A2AB] 
              rounded-[12px] 
              py-2 
              text-[14px]
            ">
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="
              flex-1 
              bg-[#D32F2F] 
              text-white 
              rounded-[12px] 
              py-2 
              text-[14px]
            ">
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCancelPopup;
