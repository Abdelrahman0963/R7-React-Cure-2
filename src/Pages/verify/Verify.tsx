import React from "react";
import { BsHeartPulse } from "react-icons/bs";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
// تأكد من صحة مسارات خدمات المصادقة ومخزن Redux
import { verifyOTP, verifyOTPRegister, resendVerifyOTP } from "@/services/auth/Auth";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/Store";
import { setToken } from "@/store/UserSlice";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

interface FormValues {
    otpNumber: string;
}

const Verify = () => {
    const [counter, setCounter] = React.useState<number>(60);
    const [otpError, setOtpError] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const location = useLocation();
    const { phoneNumber, type } = location.state || {};
    const [loading, setLoading] = React.useState(false);
    const [resending, setResending] = React.useState(false); // حالة جديدة لإعادة الإرسال

    const { handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: { otpNumber: "" },
    });

    const phoneForDisplay = sessionStorage.getItem("phone") || phoneNumber;

    // دالة إرسال النموذج
    const onSubmit = async (data: FormValues) => {
        setOtpError(false);
        if (data.otpNumber.length < 4) return;
        setLoading(true);

        const payload = { phoneNumber, otpNumber: data.otpNumber };

        try {
            const res: any = type === "register"
                ? await dispatch(verifyOTPRegister(payload))
                : await dispatch(verifyOTP(payload));

            toast.success("OTP verified successfully!");

            dispatch(setToken({
                accessToken: res.payload.data.accessToken,
                refreshToken: res.payload.data.refreshToken,
            }));

            navigate(type === "register" ? "/login" : "/");

        } catch (error) {
            setOtpError(true);
            toast.error("OTP verification failed!");
            reset({ otpNumber: "" });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setOtpError(false);
        reset({ otpNumber: "" });

        try {
            await dispatch(resendVerifyOTP({ phoneNumber }));
            toast.success("success resend otp");
            setCounter(60);
        } catch (error) {
            toast.error("error resend otp");
        } finally {
            setResending(false);
        }
    };

    React.useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [counter]);

    return (
        <section
            className="w-full p-8! px-12! h-screen flex flex-col items-start md:bg-[url('/image/background.jpg')] md:bg-no-repeat md:bg-right"
        >
            <div>
                <BsHeartPulse className="text-(--color-primary) text-3xl" />
            </div>

            <div className="h-full w-full flex items-center text-center py-6! md:px-44!">
                <div className="md:w-[420px] w-full p-4! flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold mb-2!">Code Verification</h2>
                        <p className="font-light text-[1.2rem] text-[#404448] mb-4!">
                            Code has been sent to <span className="font-semibold text-[#1490E3]">{phoneForDisplay}</span>
                        </p>
                        <p className="text-2xl text-[#1490E3]">Check your phone number</p>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex items-center flex-col gap-4"
                    >
                        <Controller
                            name="otpNumber"
                            control={control}
                            rules={{
                                required: "الكود مطلوب",
                                minLength: { value: 4, message: "يجب أن يكون الكود 4 أرقام" },
                                maxLength: { value: 4, message: "يجب أن يكون الكود 4 أرقام" },
                            }}
                            render={({ field }) => (
                                <InputOTP
                                    maxLength={4}
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
                                >
                                    <InputOTPGroup className="flex gap-4 ">
                                        <InputOTPSlot autoFocus index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />

                        {errors.otpNumber && (
                            <p className="text-red-500 text-sm">{errors.otpNumber.message}</p>
                        )}

                        {otpError && (
                            <p className="text-red-500 text-sm">code is incorrect</p>
                        )}

                        <button
                            disabled={loading || resending}
                            type="submit"
                            className="bg-[#145DB8] w-full text-white !py-4 !px-4 rounded-lg"
                        >
                            {loading ? <Spinner color="white" /> : "Verify"}
                        </button>
                    </form>

                    {/* قسم إعادة الإرسال */}
                    <div className="flex justify-center mt-4">
                        {counter === 0 ? (
                            <button
                                onClick={handleResend}
                                disabled={resending}
                                className="text-[#1490E3] hover:underline disabled:opacity-50"
                            >
                                {resending ? <Spinner color="#1490E3" /> : "Resend code"}
                            </button>
                        ) : (
                            <p>Resend code in {counter} </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Verify;
