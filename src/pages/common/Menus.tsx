import { Link } from "react-router-dom";

interface Menu {
  name: string;
  path: string;
}

interface MenusProps {
  menus: Menu[];
}

export const Menus = ({ menus }: MenusProps) => {
  return (
    <div className="flex">
      {menus.map((menu, index) => (
        <Link to={menu.path} key={index}>
          <div className="py-2 px-4 border-b hover:bg-neutral-100 hover:border-b-neutral-800">
            <p className="text-lg">{menu.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
