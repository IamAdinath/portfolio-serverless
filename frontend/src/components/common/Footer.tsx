// Footer.tsx
import React from 'react';
import { Pane, Link, IconButton, Text } from 'evergreen-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter, faGoogle, faMedium, faStackOverflow } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <Pane display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={16} background="tint2">
      <Pane display="flex" alignItems="center" marginBottom={8}>
        <Link href="https://twitter.com/prime_whites" target="_blank" marginRight={8}>
          <IconButton icon={<FontAwesomeIcon icon={faTwitter} />} />
        </Link>
        <Link href="mailto:iamadinath@protonmail.com" marginRight={8}>
          <IconButton icon={<FontAwesomeIcon icon={faGoogle} />} />
        </Link>
        <Link href="https://github.com/IamAdinath" target="_blank" marginRight={8}>
          <IconButton icon={<FontAwesomeIcon icon={faGithub} />} />
        </Link>
        <Link href="https://www.linkedin.com/in/primewhites" target="_blank" marginRight={8}>
          <IconButton icon={<FontAwesomeIcon icon={faLinkedin} />} />
        </Link>
        <Link href="https://medium.com/@adinath.17" target="_blank">
          <IconButton icon={<FontAwesomeIcon icon={faMedium} />} />
        </Link>
        <Link href="https://stackoverflow.com/users/14975561/adinath-gore" target="_blank">
          <IconButton icon={<FontAwesomeIcon icon={faStackOverflow} />} />
        </Link>
      </Pane>
      <Text size={300} color="muted">
        © {new Date().getFullYear()} Adinath Gore. All rights reserved.
      </Text>
    </Pane>
  );
};

export default Footer;
