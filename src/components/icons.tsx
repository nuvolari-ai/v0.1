type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16">
      <ellipse
        cx="7.47288"
        cy="3.38049"
        rx="1.6"
        ry="2.66667"
        transform="rotate(-30 7.47288 3.38049)"
      />
      <ellipse
        cx="11.7789"
        cy="5.25003"
        rx="1.6"
        ry="2.66667"
        transform="rotate(30 11.7789 5.25003)"
      />
      <ellipse
        cx="12.3138"
        cy="9.91641"
        rx="1.6"
        ry="2.66667"
        transform="rotate(90 12.3138 9.91641)"
      />
      <ellipse
        cx="8.53929"
        cy="12.7125"
        rx="1.6"
        ry="2.66667"
        transform="rotate(-30 8.53929 12.7125)"
      />
      <ellipse
        cx="4.22809"
        cy="10.8438"
        rx="1.6"
        ry="2.66667"
        transform="rotate(30 4.22809 10.8438)"
      />
      <ellipse
        cx="3.69661"
        cy="6.17422"
        rx="1.6"
        ry="2.66667"
        transform="rotate(90 3.69661 6.17422)"
      />
    </svg>
  ),
};
