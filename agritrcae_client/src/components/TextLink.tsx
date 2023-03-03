import NextLink, { type LinkProps as NextLinkProps } from "next/link";

import { chakra } from "@chakra-ui/react";

const TextLink = chakra<typeof NextLink, NextLinkProps>(NextLink, {
  shouldForwardProp: (prop) =>
    ["href", "target", "children", "color"].includes(prop),
});

export default TextLink;
