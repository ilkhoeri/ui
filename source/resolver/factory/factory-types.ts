import React from "react";
import { cvxResult } from "xuxi";

export type Factory<Payload extends FactoryPayload> = Payload;
export type PolymorphicFactory<Payload extends PolymorphicFactoryPayload> = Payload;

type ExtendedProps<Props = {}, OverrideProps = {}> = OverrideProps & Omit<Props, keyof OverrideProps>;

type ElementType = keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>;

type PropsOf<C extends ElementType> = React.JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

type ComponentProp<C> = {
  component?: C;
};

type InheritedProps<C extends ElementType, Props = {}> = ExtendedProps<PropsOf<C>, Props>;

export type PolymorphicRef<C> = C extends React.ElementType ? React.ComponentPropsWithRef<C>["ref"] : never;

export type PolymorphicComponentProps<C, Props = {}> = C extends React.ElementType
  ? InheritedProps<C, Props & ComponentProp<C>> & {
      ref?: PolymorphicRef<C>;
      renderRoot?(props: any): any;
    }
  : Props & {
      component: React.ElementType;
      renderRoot?(props: Record<string, any>): any;
    };

export function createPolymorphicComponent<ComponentDefaultType, Props, StaticComponents = Record<string, never>>(component: any) {
  type ComponentProps<C> = PolymorphicComponentProps<C, Props>;

  type _PolymorphicComponent = <C = ComponentDefaultType>(props: ComponentProps<C>) => React.ReactElement;

  type ComponentProperties = Omit<React.FunctionComponent<ComponentProps<any>>, never>;

  type PolymorphicComponent = _PolymorphicComponent & ComponentProperties & StaticComponents;

  return component as PolymorphicComponent;
}

export interface PolymorphicFactoryPayload extends FactoryPayload {
  defaultComponent: any;
  defaultRef: any;
}

export interface FactoryPayload {
  props: Record<string, any>;
  ctx?: any;
  ref?: any;
  stylesNames: string;
  vars?: any;
  variant?: string;
  staticComponents?: Record<string, any>;
  // Compound components cannot have classNames, styles and vars on Provider
  compound?: boolean;
}

type ResolveStyle = CSSProperties | ((theme: Theme) => CSSProperties);
export type GetStyleProp = ResolveStyle | ResolveStyle[] | GetStyleProp[] | undefined;

export interface GetStylesApiOptions {
  id?: string;
  className?: string;
  style?: StyleProp;
  focusable?: boolean;
  active?: boolean;
  classNames?: ClassNames<{ props: any; stylesNames: string }>;
  styles?: Styles<{ props: any; stylesNames: string }>;
  variant?: string;
  props?: Record<string, any>;
  attrs?: Record<string, string | undefined>;
  // open?: boolean;
  // modal?: boolean;
  // defaultOpen?: boolean;
}

export type StylesApiRecord<Payload extends FactoryPayload, DataType> = Payload["compound"] extends true
  ? Payload["stylesNames"] extends string
    ? StylesRecord<Payload["stylesNames"], DataType>
    : never
  : Payload["stylesNames"] extends string
    ? StylesRecord<Payload["stylesNames"], DataType> | ((theme: Theme, props: Payload["props"], ctx: Payload["ctx"]) => StylesRecord<Payload["stylesNames"], DataType>)
    : never;

export type Styles<Payload extends FactoryPayload> = StylesApiRecord<Payload, CSSProperties>;
export type ClassNames<Payload extends FactoryPayload> = StylesApiRecord<Payload, string>;
export type ClassNamesArray<Payload extends FactoryPayload> = (StylesApiRecord<Payload, string> | undefined)[];

export type StylesRecord<StylesNames extends string, Payload> = Partial<Record<StylesNames, Payload>>;

export interface StylesApiProps<Payload extends FactoryPayload> {
  unstyled?: boolean;
  variant?: Payload["variant"] extends string ? Payload["variant"] | (string & {}) : string;
  classNames?: ClassNames<Payload>;
  styles?: Styles<Payload>;
  className?: string;
  style?: CSSProperties;
  vars?: PartialVarsResolver<Payload>;
}

export interface CompoundStylesApiProps<Payload extends FactoryPayload> extends StylesApiProps<Payload> {}

export type ElementProps<ElementType extends React.ElementType, PropsToOmit extends string = never> = Omit<React.ComponentPropsWithoutRef<ElementType>, "style" | PropsToOmit>;

export type ColorsTuple = readonly [string, string, string, string, string, string, string, string, string, string, ...string[]];

export type ColorShade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface PrimaryShade {
  light: ColorShade;
  dark: ColorShade;
}

type ThemeComponents = {
  [x: string]: ThemeComponent;
};

export interface ThemeOther {
  [key: string]: any;
}

export type Theme = {
  scale: number;
  colors: string;
  breakpoints: {
    [x: string & NonNullable<unknown>]: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  focusClassName: string;
  activeClassName: string;
  respectReducedMotion: boolean;
  components: ThemeComponents;
  other: ThemeOther;
} | null;

export interface CSSProperties extends React.CSSProperties {
  [key: string]: any;
}

type Style = CSSProperties | ((theme: Theme) => CSSProperties);
export type StyleProp = Style | Style[] | StyleProp[] | undefined;

export type CssVariable = `--${string}`;

export type CssVariables<Variable extends string = CssVariable> = Partial<Record<Variable, string>>;

export type CssVars<Variable extends string = CssVariable> = CssVariables<Variable> | ((theme: Theme) => CssVariables<Variable>) | CssVars<Variable>[];

export type CssVarsProp<Variable extends string = CssVariable> = CssVars<Variable> | CssVars<Variable>[];

export type TransformVars<V> = {
  [Key in keyof V]: V[Key] extends CssVariable ? Record<V[Key], string | undefined> : never;
};

export type PartialTransformVars<V> = {
  [Key in keyof V]: V[Key] extends CssVariable ? Partial<Record<V[Key], string | undefined>> : never;
};

export type VarsResolver<Payload extends FactoryPayload> = (theme: Theme, props: Payload["props"], ctx: Payload["ctx"]) => TransformVars<Payload["vars"]>;

export type PartialVarsResolver<Payload extends FactoryPayload> = (theme: Theme, props: Payload["props"], ctx: Payload["ctx"]) => PartialTransformVars<Payload["vars"]>;

export interface ThemeComponent {
  classNames?: any;
  styles?: any;
  vars?: any;
  defaultProps?: any;
}

export type DataAttributes = Record<`data-${string}`, any>;

export interface ExtendCompoundComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload["props"]> & DataAttributes;
}

export interface ExtendsRootComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload["props"]> & DataAttributes;
  classNames?: ClassNames<Payload>;
  styles?: Styles<Payload>;
  vars?: PartialVarsResolver<Payload>;
}

export type ExtendComponent<Payload extends FactoryPayload> = Payload["compound"] extends true ? ExtendCompoundComponent<Payload> : ExtendsRootComponent<Payload>;

export type StaticComponents<Input> = Input extends Record<string, any> ? Input : Record<string, never>;

export interface ThemeExtend<Payload extends FactoryPayload> {
  extend: (input: ExtendComponent<Payload>) => ThemeComponent;
}

export type ComponentClasses<Payload extends FactoryPayload> = {
  classes: Payload["stylesNames"] extends string ? (variant?: cvxResult<{ selector: { [key: string]: string } }>) => string : never;
};

export type ComponentStaticProperties<Payload extends FactoryPayload> = ThemeExtend<Payload> & ComponentClasses<Payload> & StaticComponents<Payload["staticComponents"]>;

export type Component<Payload extends FactoryPayload> = React.ForwardRefExoticComponent<Payload["props"] & React.RefAttributes<Payload["ref"]>> & ComponentStaticProperties<Payload>;

export type FilterPropsRes<T extends Record<string, any>> = {
  [Key in keyof T]-?: T[Key] extends undefined ? never : T[Key];
};

export interface UseStyles<Payload extends FactoryPayload> {
  name: string | (string | undefined)[];
  classes: Payload["stylesNames"] extends string ? (variant?: cvxResult<{ selector: { [key: string]: string } }>) => string : never;
  // classes: Payload["stylesNames"] extends string ? Record<string, string> : never;
  props: Payload["props"];
  stylesCtx?: Payload["ctx"];
  className?: string;
  style?: GetStyleProp;
  rootSelector?: Payload["stylesNames"];
  unstyled?: boolean;
  classNames?: ClassNames<Payload> | ClassNamesArray<Payload>;
  styles?: Styles<Payload>;
  classNamesPrefix?: string;
  // attrs?: Record<string, string | undefined>;
  // open?: boolean;
  // modal?: boolean;
  // defaultOpen?: boolean;
}

export type GetStylesApi<Payload extends FactoryPayload> = (
  selector: NonNullable<Payload["stylesNames"]>,
  options?: GetStylesApiOptions
) => {
  className: string;
  style: CSSProperties;
};

export type AnchorTargets = {
  /**
   * Target property **`<a>`** :
   *
   * `Please note that some target values may behave differently depending on configuration and browser used.`
   *
   * **`_self`** : Opens the link in the same window or frame.
   *
   * **`_blank`** : Opens the link in a new window or tab.
   *
   * **`_parent`** : Opens the link in the parent frame (if any).
   *
   * **`_top`** : Opens the link at the very top of the window (closes all frames if any).
   *
   * **`_search`** : Used to search for specific text on the intended page.
   *
   * **`_media`** : Used to indicate specific media content (for example, audio or video).
   *
   * **`_messaging`** : Used to communicate with a specific message channel.
   *
   * **`_email`** : Used to open the default email program with the specified email address.
   *
   * **`_ftp`** : Used to open an FTP program with the specified address.
   *
   * **`_tel`** : Used to open the phone application with the specified phone number.
   *
   * **`_sms`** : Used to open the text messaging application with the specified phone number.
   *
   * **`_file`** : Used to open local files on the user's system.
   *
   * **`_about`** : Used to open information about the intended page.
   *
   * **`_calendar`** : Opens the default calendar application with the specified events.
   *
   * **`_contacts`** : Opens the default contacts application with the specified contact.
   *
   * **`_noopener`** : Opens a link by not allowing the target link to access window.opener on the intended page.
   *
   * **`_noreferrer`** : Opens a link by not sending an HTTP referer to the intended page.
   *
   * **`_external`** : A special value that can be specified by a custom implementation to open a link to an external context or a custom application.
   */
  target?: "_about" | "_blank" | "_calendar" | "_contacts" | "_email" | "_external" | "_file" | "_ftp" | "_media" | "_messaging" | "_noopener" | "_noreferrer" | "_parent" | "_search" | "_self" | "_sms" | "_tel" | "_top" | (string & NonNullable<unknown>);
};
