import React from "react";

const ProgressBar = ({ currentStep }) => {
    const steps = [
        { step: 1, label: "Shipping Info" },
        { step: 2, label: "Confirm Order" },
        { step: 3, label: "Payment" },
    ];

    return (
        <div className="flex items-center justify-between mt-2 mb-6">
            {steps.map((step, index) => (
                <React.Fragment key={step.step}>
                    <div className="flex flex-col items-center md:w-24 w-fit">
                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${currentStep >= step.step
                                ? "bg-blue-600 text-white"
                                : "bg-gray-300 text-gray-500"
                                }`}
                        >
                            {step.step}
                        </div>
                        <span
                            className={`text-sm mt-2 ${currentStep >= step.step
                                ? "text-blue-600 font-medium"
                                : "text-gray-500 font-medium"
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>

                    {index !== steps.length - 1 && (
                        <div
                            className={`flex-1 h-[2px] items-center -mt-8 md:mx-1 md:block hidden ${currentStep > step.step
                                ? "bg-blue-600 font-medium"
                                : "bg-gray-300 font-medium"
                                }`}
                        ></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ProgressBar;
