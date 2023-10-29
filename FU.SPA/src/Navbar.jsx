export default function Navbar() {
  return (
    <nav className="nav">
      <a href="/" className="site-title"> 
      Forces Unite
      </a>
      <ul>
        <CustomLink href="/home">Home</CustomLink>
        <CustomLink href="/discover">Discover</CustomLink>
        <CustomLink href="/social">Social</CustomLink>
        <CustomLink href="/create">Create</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({href, children, ...props }) {
  const path = window.location.pathname
  return (
    <li className={path === href ? "active" : ""}>
      <a href={href} {...props}>{children}</a>
    </li>
  )
}

