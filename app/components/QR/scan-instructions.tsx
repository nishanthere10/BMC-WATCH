import { Info, Lightbulb, ShieldCheck, Smartphone } from "lucide-react";

export default function ScanInstructions() {
  const steps = [
    {
      icon: <Smartphone size={18} />,
      title: "Positioning",
      text: "Hold your phone 6-10 inches away from the QR code."
    },
    {
      icon: <Lightbulb size={18} />,
      title: "Lighting",
      text: "Ensure the code is well-lit and not covered by shadows."
    },
    {
      icon: <ShieldCheck size={18} />,
      title: "Trust",
      text: "Only scan official BMC barricade codes for authentic data."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary">
        <Info size={20} />
        <h3 className="font-bold uppercase tracking-tight text-sm">How to use BMC Watch</h3>
      </div>

      <div className="grid gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}