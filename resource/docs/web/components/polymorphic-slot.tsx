import * as React from "react";
import { cn } from "@/utils/cn";

export type Element<T> = { el?: T | (React.ElementType & {}); style?: CSSProperties };
export type CSSProperties = React.CSSProperties & Record<string, any>;
export type ElementType = keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>;
export type PolymorphicRef<T> = T extends React.ElementType ? React.ComponentPropsWithRef<T>["ref"] : never;
export type ExtendedProps<Props = object, OverrideProps = object> = OverrideProps & Omit<Props, keyof OverrideProps>;
export type PropsOf<T extends ElementType> = React.JSX.LibraryManagedAttributes<T, React.ComponentPropsWithoutRef<T>>;
export type InheritedProps<T extends ElementType, Props = object> = ExtendedProps<PropsOf<T>, Props>;
export type ComponentProps<T extends React.ElementType, Exclude extends string = never> = React.PropsWithoutRef<Omit<React.ComponentProps<T>, "style" | Exclude>> & {
  style?: CSSProperties;
};
export type CreatePolymorphicType<T, Props = object> = T extends React.ElementType
  ? InheritedProps<T, Props & Element<T>> & {
      ref?: PolymorphicRef<T>;
      renderRoot?: (props: any) => any;
    }
  : Props & {
      el: React.ElementType;
      renderRoot?: (props: Record<string, any>) => any;
    };

export function createPolymorphic<ComponentDefaultType, Props, StaticComponents = Record<string, never>>(el: any) {
  type ComponentProps<T> = CreatePolymorphicType<T, Props>;
  type _Polymorphic = <T = ComponentDefaultType>(props: ComponentProps<T>) => React.ReactElement;
  type ComponentProperties = Omit<React.FunctionComponent<ComponentProps<any>>, never>;
  type Polymorphic = _Polymorphic & ComponentProperties & StaticComponents;

  return el as Polymorphic;
}

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const PolymorphicSlot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = slottable.props.children;

    const newChildren = childrenArray.map(child => {
      if (child === slottable) {
        if (React.Children.count(newElement) > 1) return React.Children.only(null);
        return React.isValidElement(newElement) ? (newElement.props as { children: React.ReactNode }).children : null;
      } else {
        return child;
      }
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement) ? React.cloneElement(newElement, undefined, newChildren) : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});
PolymorphicSlot.displayName = "PolymorphicSlot";

type PossibleRef<T> = React.Ref<T> | undefined;

export function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== undefined) {
    // @ts-ignore
    ref.current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return node => {
    let hasCleanup = false;
    const cleanups = refs.map(ref => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

export function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

interface SlotCloneProps extends ComponentProps<"div"> {
  children: React.ReactNode;
}

const SlotClone = React.forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (React.isValidElement(children)) {
    const childrenRef = getElementRef(children);
    return React.cloneElement(children, {
      ...mergeProps(slotProps, children.props as AnyProps),
      // @ts-ignore
      ref: forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef,
      style: { ...slotProps.style, ...(children.props as any).style },
      className: cn(slotProps.className, (children.props as any).className)
    });
  }

  return React.Children.count(children) > 1 ? React.Children.only(null) : null;
});

SlotClone.displayName = "SlotClone";

export const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

type AnyProps = Record<string, any>;

function isSlottable(child: React.ReactNode): child is React.ReactElement<ComponentProps<typeof Slottable>, typeof Slottable> {
  return React.isValidElement(child) && child.type === Slottable;
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

function getElementRef(element: React.ReactElement) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;

  if (mayWarn) return (element as any).ref;

  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<unknown> }).ref;
  }

  return (element.props as { ref?: React.Ref<unknown> }).ref || (element as any).ref;
}

export const Root = PolymorphicSlot;

// Function to insert component into the first element of children
export function injectComponentIntoFirstChild(children: React.ReactNode, component: React.ReactNode): React.ReactNode {
  // If only one element, add a component at the beginning
  if (React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement,
      {
        children: (
          <>
            {component}
            {(children.props as any).children}
          </>
        )
      } as any
    );
  }

  // If children is an array, add a component to the first element
  if (Array.isArray(children)) {
    const [firstChild, ...rest] = children as React.ReactElement[];
    if (React.isValidElement(firstChild as React.ReactElement)) {
      return [
        React.cloneElement(
          firstChild as React.ReactElement,
          {
            children: (
              <>
                {component}
                {(firstChild.props as any)?.children} {/* Access props safely */}
              </>
            )
          } as any
        ),
        ...rest
      ];
    }
  }

  return children; // If invalid, return children as is
}

export type PolymorphicProps<T extends React.ElementType = "div", Props = object> = InheritedProps<T, Element<T> & Props> & {
  asChild?: boolean;
  ref?: React.ComponentPropsWithRef<T>["ref"];
};
type PolymorphicElement = <T extends React.ElementType = "div">(_props: PolymorphicProps<T>) => React.ReactElement;
// @ts-ignore
export const Polymorphic = React.forwardRef(function Polymorphic<T extends React.ElementType = "div">(_props: Omit<PolymorphicProps<T>, "ref">, ref: PolymorphicRef<T>) {
  const { asChild = false, el, ...props } = _props;
  const Component = asChild ? PolymorphicSlot : ((el || "div") as React.ElementType);
  return <Component {...{ ref, ...props }} />;
}) as PolymorphicElement;
// export default Polymorphic;
