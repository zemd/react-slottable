import type { PropsWithSlots } from "./types";
import { useSlot } from "./use-slot";

const DefaultDecorator: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={className}>Default decorator</div>;
};

type ButtonProps = PropsWithSlots<
  React.PropsWithChildren<{
    // here you define your regular component props
    fullWidth?: boolean;
    disabled?: boolean;
    size?: "sm" | "md" | "xl";
    variant?: "solid" | "outlined";
    color?: "primary" | "secondary";
    className?: string;
  }>,
  ["startDecorator", "endDecorator"] // here you define your slots
>;

export const Button: React.FC<ButtonProps> = (props) => {
  const StartDecoratorSlot = useSlot("startDecorator", props, {
    slot: DefaultDecorator, // provide default decorator, but can be overridden by user
  });
  const EndDecoratorSlot = useSlot("endDecorator", props);

  return (
    <button className={props.className}>
      <StartDecoratorSlot className="class-override" />
      {/* ^^^ you can provide default className ^^^ */}
      {props.children}
      <EndDecoratorSlot />
    </button>
  );
};

const MyCustomLabelComponent: React.FC = () => {
  return <span>My custom label</span>;
};

export function HomePage(): React.JSX.Element {
  return (
    <div>
      <Button
        slots={{
          endDecorator: MyCustomLabelComponent,
        }}
        slotProps={{
          startDecorator: {
            // prop1: "value"
          },
          endDecorator: {
            // prop2: "value"
          },
        }}
        className="my-custom-button-className"
      >
        Click me!
      </Button>
    </div>
  );
}
