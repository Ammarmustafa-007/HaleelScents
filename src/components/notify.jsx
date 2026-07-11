import { toast } from "react-toastify";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  ShieldAlert,
  Trash2,
} from "lucide-react";

const styles = {
  success: {
    icon: CheckCircle2,
    title: "Success",
    ring: "ring-[#f472b6]/20",
    iconBg: "bg-[#fce7f3] text-[#db2777]",
    bar: "bg-[#f472b6]",
  },
  error: {
    icon: AlertCircle,
    title: "Action needed",
    ring: "ring-red-100",
    iconBg: "bg-red-50 text-red-600",
    bar: "bg-red-500",
  },
  info: {
    icon: Info,
    title: "Note",
    ring: "ring-sky-100",
    iconBg: "bg-sky-50 text-sky-600",
    bar: "bg-sky-500",
  },
  warning: {
    icon: ShieldAlert,
    title: "Please confirm",
    ring: "ring-amber-100",
    iconBg: "bg-amber-50 text-amber-600",
    bar: "bg-amber-500",
  },
};

const NotificationCard = ({ type = "info", title, message }) => {
  const style = styles[type] || styles.info;
  const Icon = style.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-white p-4 shadow-2xl ring-1 ${style.ring}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
        >
          <Icon size={22} strokeWidth={2.4} />
        </div>

        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-[#db2777]">
            {title || style.title}
          </p>
          <p className="mt-1 text-sm leading-5 text-[#4c1d95]">{message}</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-[#fbcfe8]">
        <div className={`h-full notification-progress ${style.bar}`} />
      </div>
    </div>
  );
};

const baseOptions = {
  closeButton: false,
  hideProgressBar: true,
  icon: false,
  className: "scent-toast-shell",
  bodyClassName: "scent-toast-body",
};

const show = (type, message, options = {}) =>
  toast(<NotificationCard type={type} message={message} title={options.title} />, {
    ...baseOptions,
    autoClose: options.autoClose ?? 3200,
  });

export const notify = {
  success: (message, options) => show("success", message, options),
  error: (message, options) => show("error", message, options),
  info: (message, options) => show("info", message, options),
  warning: (message, options) => show("warning", message, options),
  confirmDelete: (message, onConfirm) =>
    toast(
      ({ closeToast }) => (
        <div className="rounded-lg bg-white p-4 shadow-2xl ring-1 ring-red-100">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Trash2 size={21} strokeWidth={2.4} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#ffffff]">
                Delete item?
              </p>
              <p className="mt-1 text-sm leading-5 text-[#5f5544]">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeToast}
              className="rounded-md border border-[#f472b6]/30 px-3 py-2 text-sm font-medium text-[#ffffff] transition hover:bg-[#fff3cd]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                await onConfirm();
                closeToast();
              }}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        ...baseOptions,
        autoClose: false,
        closeOnClick: false,
      },
    ),
};
