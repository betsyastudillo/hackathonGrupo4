import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Collapse, Container } from 'reactstrap';

import navdata from '../LayoutMenuData';
import SimpleBar from 'simplebar-react';
import VerticalLayout from '../VerticalLayouts';
import { fetchMenusProfileWS } from '../../slices/menus/thunk';
import { setMenus } from '../../slices/thunks';
import { MENUSICONS } from '@/assets/images';


// Componente para el menú con subItems
const MenuItemWithSubItems = ({ item, handleClick }) => (
  <li>
    <a
      onClick={(e) => handleClick(e, item)}
      subitems={item.id}
      className="nav-icon"
    >
      <img src={MENUSICONS[item.icon]} alt="icon" />
    </a>
    <p>{item.label}</p>
  </li>
);

// Componente para el menú sin subItems
const MenuItemWithoutSubItems = ({ item }) => (
  <Link
    onClick={item.click}
    to={item.link ? item.link : '/#'}
    subitems={item.id}
    className="nav-icon"
  >
    <i className={item.icon}></i>
  </Link>
);

// Componente FirstMenu
const FirstMenu = ({ navData, handleClick }) => (
  (navData || []).map((item, key) => (
    <React.Fragment key={key}>
      {item.icon && (
        item.subItems.length > 0
          ? <MenuItemWithSubItems item={item} handleClick={handleClick} />
          : <MenuItemWithoutSubItems item={item} />
      )}
    </React.Fragment>
  ))
);


const TwoColumnLayout = props => {

  const location = useLocation();  // Replaces props.router.location
  const navData = navdata().props.children;

  const dispatch  = useDispatch(); // Router y Redux
  // Variables del stage
  const user       = useSelector(state => state.Login.user);
  const menus      = useSelector(state => state.Menus.menus);
  const activeMenu = useSelector(state => state.Menus.activeMenu);

  const activateParentDropdown = useCallback(item => {
    item.classList.add('active');
    let parentCollapseDiv = item.closest('.collapse.menu-dropdown');
    if (parentCollapseDiv) {
      parentCollapseDiv.classList.add('show');
      parentCollapseDiv.parentElement.children[0].classList.add('active');
      parentCollapseDiv.parentElement.children[0].setAttribute(
        'aria-expanded',
        'true'
      );
      if (parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown')) {
        parentCollapseDiv.parentElement
          .closest('.collapse')
          .classList.add('show');
        const parentParentCollapse =
          parentCollapseDiv.parentElement.closest(
            '.collapse'
          ).previousElementSibling;
        if (parentParentCollapse) {
          parentParentCollapse.classList.add('active');
          if (parentParentCollapse.closest('.collapse.menu-dropdown')) {
            parentParentCollapse
              .closest('.collapse.menu-dropdown')
              .classList.add('show');
          }
        }
      }
      activateIconSidebarActive(parentCollapseDiv.getAttribute('id'));
      return false;
    }
    return false;
  }, []);

  const initMenu = useCallback(() => {
    const pathName = `${import.meta.env.PUBLIC_URL}${location.pathname}`;
    const ul = document.getElementById('navbar-nav');
    const items = ul.getElementsByTagName('a');
    let itemsArray = [...items]; // converts NodeList to Array
    removeActivation(itemsArray);
    let matchingMenuItem = itemsArray.find(x => {
      return x.pathname === pathName;
    });
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    } else {
      let id = pathName.replace(`${import.meta.env.PUBLIC_URL}/`, '');
      if (id) document.body.classList.add('twocolumn-panel');
      activateIconSidebarActive(id);
    }
  }, [location.pathname, activateParentDropdown]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initMenu();
  }, [location.pathname, initMenu]);

  useEffect(() => {
    if (props.layoutType === 'twocolumn') {
      window.addEventListener('resize', windowResizeHover);
      return () => { window.removeEventListener('resize', windowResizeHover); };
    }
  }, [props.layoutType]);

  useEffect(() => {
    if (user?.codUsuario && user?.codEmpresa) {
      getMenus();
    }
  },[user])
  
  const getMenus = async () => {
    try {      
      const { data } = await fetchMenusProfileWS(user.codUsuario, user.codEmpresa);
      dispatch(setMenus(data));
      // console.log("el nuevo menu es---<", menus)
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  function activateIconSidebarActive(id) {
    var menu = document.querySelector(
      "#two-column-menu .simplebar-content-wrapper a[subitems='" +
        id +
        "'].nav-icon"
    );
    if (menu !== null) {
      menu.classList.add('active');
    }
  }

  const removeActivation = items => {
    let activeItems = items.filter(x => x.classList.contains('active'));
    activeItems.forEach(item => {
      if (item.classList.contains('menu-link')) {
        if (!item.classList.contains('active')) {
          item.setAttribute('aria-expanded', false);
        }
        item.nextElementSibling.classList.remove('show');
      }
      if (item.classList.contains('nav-link')) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove('show');
        }
        item.setAttribute('aria-expanded', false);
      }
      item.classList.remove('active');
    });

    const ul = document.getElementById('two-column-menu');
    const iconItems = ul.getElementsByTagName('a');
    let itemsArray = [...iconItems];
    let activeIconItems = itemsArray.filter(x =>
      x.classList.contains('active')
    );
    activeIconItems.forEach(item => {
      item.classList.remove('active');
      var id = item.getAttribute('subitems');
      if (document.getElementById(id))
        document.getElementById(id).classList.remove('show');
    });
  };

  const [isMenu, setIsMenu] = useState('twocolumn');

  const windowResizeHover = () => {
    initMenu();
    var windowSize = document.documentElement.clientWidth;
    if (windowSize < 767) {
      document.documentElement.setAttribute('data-layout', 'vertical');
      setIsMenu('vertical');
    } else {
      document.documentElement.setAttribute('data-layout', 'twocolumn');
      setIsMenu('twocolumn');
    }
  };

  // Manipulador de menus
  const handleClick = (e, item) => {
    e.preventDefault();
    item.click();  // Asegúrate de que este llame a `navigate`
  }

  return (
    <>
      {isMenu === 'twocolumn' ? (
        <div id="scrollbar">
          <Container fluid>
            <div id="two-column-menu">
              <SimpleBar className="twocolumn-iconview">
                <li>
                  <Link to="" className="nav-icon" style={{ marginTop: '15px' }} >
                    <img src={MENUSICONS['menu']} alt="icon" />
                  </Link>
                </li>
                <FirstMenu navData={navData} handleClick={handleClick} />                
              </SimpleBar>
            </div>

            <SimpleBar id="navbar-nav" className="navbar-nav" style={{ marginTop: '50px' }}>
              { activeMenu !== null ? (
                  <React.Fragment key={activeMenu.id}>
                    {activeMenu.submenus && activeMenu.submenus.length > 0 ? (
                        <li className="nav-item">
                          <Collapse 
                            className="menu-dropdown"
                            isOpen={true}
                            id={activeMenu.id}
                          >
                            <p className="nav nav-sm flex-column test text-primary" style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
                              {activeMenu.nomMenu}
                            </p>
                            <ul className="nav nav-sm flex-column test">
                              {activeMenu.submenus && (activeMenu.submenus || []).map((submenu, key) => (
                                <React.Fragment key={key}>
                                  <li className="nav-item">
                                    <Link
                                      to={submenu.urlReact ? submenu.urlReact : '/#'}
                                      className="nav-link"
                                    >
                                      {submenu.nomItem}
                                    </Link>
                                  </li>
                                </React.Fragment>
                              ))}
                            </ul>

                          </Collapse>
                          
                        </li>
                      ) : null
                    }
                  </React.Fragment>
                ) : null
              }
            </SimpleBar>
          </Container>
        </div>
      ) : (
        <SimpleBar id="scrollbar" className="h-100">
          <Container fluid>
            <div id="two-column-menu"></div>
            <ul className="navbar-nav" id="navbar-nav">
              <VerticalLayout />
            </ul>
          </Container>
        </SimpleBar>
      )}
    </>
  );
};

TwoColumnLayout.propTypes = {
  layoutType: PropTypes.string,
};

export default TwoColumnLayout;

// const TwoColumnLayout = props => {
//   const location = useLocation(); // Replaces props.router.location
  
//   const MENUSICONS = {
//     inicio,
//     ventas,
//     pagos,
//     admon,
//     ayuda,
//     menu,
//   };

//   const navData = navdata().props.children;

//   // Router y Redux
//   const dispatch  = useDispatch();
//   // Variables del stage
//   const user      = useSelector(state => state.Login.user);
//   const menus     = useSelector(state => state.Menus.menus);

//   const activateParentDropdown = useCallback(item => {
//     item.classList.add('active');
//     let parentCollapseDiv = item.closest('.collapse.menu-dropdown');
//     if (parentCollapseDiv) {
//       parentCollapseDiv.classList.add('show');
//       parentCollapseDiv.parentElement.children[0].classList.add('active');
//       parentCollapseDiv.parentElement.children[0].setAttribute(
//         'aria-expanded',
//         'true'
//       );
//       if (parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown')) {
//         parentCollapseDiv.parentElement
//           .closest('.collapse')
//           .classList.add('show');
//         const parentParentCollapse =
//           parentCollapseDiv.parentElement.closest(
//             '.collapse'
//           ).previousElementSibling;
//         if (parentParentCollapse) {
//           parentParentCollapse.classList.add('active');
//           if (parentParentCollapse.closest('.collapse.menu-dropdown')) {
//             parentParentCollapse
//               .closest('.collapse.menu-dropdown')
//               .classList.add('show');
//           }
//         }
//       }
//       activateIconSidebarActive(parentCollapseDiv.getAttribute('id'));
//       return false;
//     }
//     return false;
//   }, []);

//   const initMenu = useCallback(() => {
//     const pathName = `${import.meta.env.PUBLIC_URL}${location.pathname}`;
//     const ul = document.getElementById('navbar-nav');
//     const items = ul.getElementsByTagName('a');
//     let itemsArray = [...items]; // converts NodeList to Array
//     removeActivation(itemsArray);
//     let matchingMenuItem = itemsArray.find(x => {
//       return x.pathname === pathName;
//     });
//     if (matchingMenuItem) {
//       activateParentDropdown(matchingMenuItem);
//     } else {
//       let id = pathName.replace(`${import.meta.env.PUBLIC_URL}/`, '');
//       if (id) document.body.classList.add('twocolumn-panel');
//       activateIconSidebarActive(id);
//     }
//   }, [location.pathname, activateParentDropdown]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     initMenu();
//   }, [location.pathname, initMenu]);

//   useEffect(() => {
//     if (props.layoutType === 'twocolumn') {
//       window.addEventListener('resize', windowResizeHover);
//       return () => {
//         window.removeEventListener('resize', windowResizeHover);
//       };
//     }
//   }, [props.layoutType]);

//   useEffect(() => {
//     if (user?.codUsuario && user?.codEmpresa) {
//       getMenus();
//     }
//   },[user])

//   const getMenus = async () => {
//     try {      

//       const { data } = await fetchMenusProfileWS(user.codUsuario, user.codEmpresa);
//       dispatch(setMenus(data));
//       console.log("el nuevo menu es---<", menus)
//     } catch (err) {
//       console.error('Error fetching companies:', err);
//     }
//   };

//   function activateIconSidebarActive(id) {
//     var menu = document.querySelector(
//       "#two-column-menu .simplebar-content-wrapper a[subitems='" +
//         id +
//         "'].nav-icon"
//     );
//     if (menu !== null) {
//       menu.classList.add('active');
//     }
//   }

//   const removeActivation = items => {
//     let activeItems = items.filter(x => x.classList.contains('active'));
//     activeItems.forEach(item => {
//       if (item.classList.contains('menu-link')) {
//         if (!item.classList.contains('active')) {
//           item.setAttribute('aria-expanded', false);
//         }
//         item.nextElementSibling.classList.remove('show');
//       }
//       if (item.classList.contains('nav-link')) {
//         if (item.nextElementSibling) {
//           item.nextElementSibling.classList.remove('show');
//         }
//         item.setAttribute('aria-expanded', false);
//       }
//       item.classList.remove('active');
//     });

//     const ul = document.getElementById('two-column-menu');
//     const iconItems = ul.getElementsByTagName('a');
//     let itemsArray = [...iconItems];
//     let activeIconItems = itemsArray.filter(x =>
//       x.classList.contains('active')
//     );
//     activeIconItems.forEach(item => {
//       item.classList.remove('active');
//       var id = item.getAttribute('subitems');
//       if (document.getElementById(id))
//         document.getElementById(id).classList.remove('show');
//     });
//   };

//   const [isMenu, setIsMenu] = useState('twocolumn');
//   const windowResizeHover = () => {
//     initMenu();
//     var windowSize = document.documentElement.clientWidth;
//     if (windowSize < 767) {
//       document.documentElement.setAttribute('data-layout', 'vertical');
//       setIsMenu('vertical');
//     } else {
//       document.documentElement.setAttribute('data-layout', 'twocolumn');
//       setIsMenu('twocolumn');
//     }
//   };

//   // const toogleMenuBtn = () => {
//   //   var windowSize = document.documentElement.clientWidth;
//   //   dispatch(changeSidebarVisibility('show'));

//   //   if (windowSize > 767)
//   //     document.querySelector('.hamburger-icon').classList.toggle('open');

//   //   if (document.documentElement.getAttribute('data-layout') === 'horizontal') {
//   //     document.body.classList.contains('menu')
//   //       ? document.body.classList.remove('menu')
//   //       : document.body.classList.add('menu');
//   //   }

//   //   if (
//   //     sidebarVisibilitytype === 'show' &&
//   //     (document.documentElement.getAttribute('data-layout') === 'vertical' ||
//   //       document.documentElement.getAttribute('data-layout') === 'semibox')
//   //   ) {
//   //     if (windowSize < 1025 && windowSize > 767) {
//   //       document.body.classList.remove('vertical-sidebar-enable');
//   //       document.documentElement.getAttribute('data-sidebar-size') === 'sm'
//   //         ? document.documentElement.setAttribute('data-sidebar-size', '')
//   //         : document.documentElement.setAttribute('data-sidebar-size', 'sm');
//   //     } else if (windowSize > 1025) {
//   //       document.body.classList.remove('vertical-sidebar-enable');
//   //       document.documentElement.getAttribute('data-sidebar-size') === 'lg'
//   //         ? document.documentElement.setAttribute('data-sidebar-size', 'sm')
//   //         : document.documentElement.setAttribute('data-sidebar-size', 'lg');
//   //     } else if (windowSize <= 767) {
//   //       document.body.classList.add('vertical-sidebar-enable');
//   //       document.documentElement.setAttribute('data-sidebar-size', 'lg');
//   //     }
//   //   }

//   //   if (document.documentElement.getAttribute('data-layout') === 'twocolumn') {
//   //     document.body.classList.contains('twocolumn-panel')
//   //       ? document.body.classList.remove('twocolumn-panel')
//   //       : document.body.classList.add('twocolumn-panel');
//   //   }
//   // };

//   return (
//     <>
//       {isMenu === 'twocolumn' ? (
//         <div id="scrollbar">
//           <Container fluid>
//             <div id="two-column-menu">
//               <SimpleBar className="twocolumn-iconview">
//                 {/* <button
//                   onClick={toogleMenuBtn}
//                   type="button"
//                   className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
//                   id="topnav-hamburger-icon"
//                 >
//                   <span className="hamburger-icon">
//                     <span></span>
//                     <span></span>
//                     <span></span>
//                   </span>
//                 </button> */}
//                 <li>
//                   <Link
//                     to=""
//                     className="nav-icon"
//                     style={{ marginTop: '15px' }}
//                   >
//                     <img src={MENUSICONS['menu']} alt="icon" />
//                   </Link>
//                 </li>
//                 {/* <Link to="#" className="logo">
//                   <img src={MENUSICONS['menu']} alt="icon" />
//                 </Link> */}
//                 <li>
//                   <Link to="/dashboard" className="nav-icon">
//                     <img src={MENUSICONS['inicio']} alt="icon" />
//                   </Link>
//                   <p>Inicio</p>
//                 </li>
//                 {(navData || []).map((item, key) => (
//                   <React.Fragment key={key}>
//                     {item.icon &&
//                       (item.subItems ? (
//                         <li>
//                           <Link
//                             onClick={item.click}
//                             to="#"
//                             subitems={item.id}
//                             className="nav-icon"
//                           >
//                             <img src={MENUSICONS[item.icon]} alt="icon" />
//                           </Link>
//                           <p>{item.label}</p>
//                         </li>
//                       ) : (
//                         <Link
//                           onClick={item.click}
//                           to={item.link ? item.link : '/#'}
//                           subitems={item.id}
//                           className="nav-icon"
//                         >
//                           <i className={item.icon}></i>
//                         </Link>
//                       ))}
//                   </React.Fragment>
//                 ))}
//               </SimpleBar>
//             </div>
//             <SimpleBar
//               id="navbar-nav"
//               className="navbar-nav"
//               style={{ marginTop: '50px' }}
//             >
//               {(navData || []).map((item, key) => (
//                 <React.Fragment key={key}>
//                   {item.subItems ? (
//                     <li className="nav-item">
//                       <Collapse
//                         className="menu-dropdown"
//                         isOpen={item.stateVariables}
//                         id={item.id}
//                       >
//                         <ul className="nav nav-sm flex-column test">
//                           <p
//                             className="text-primary"
//                             style={{ fontSize: '15px', fontWeight: 600 }}
//                           >
//                             {item.label}
//                           </p>
//                           {item.subItems &&
//                             (item.subItems || []).map((subItem, key) => (
//                               <React.Fragment key={key}>
//                                 {!subItem.isChildItem ? (
//                                   <li className="nav-item">
//                                     <Link
//                                       to={subItem.link ? subItem.link : '/#'}
//                                       className="nav-link"
//                                     >
//                                       {subItem.label}
//                                       {subItem.badgeName && (
//                                         <span
//                                           className={`badge badge-pill bg-${subItem.badgeColor}`}
//                                         >
//                                           {subItem.badgeName}
//                                         </span>
//                                       )}
//                                     </Link>
//                                   </li>
//                                 ) : (
//                                   <li className="nav-item">
//                                     <Link
//                                       onClick={subItem.click}
//                                       className="nav-link"
//                                       to="/#"
//                                     >
//                                       {subItem.label}
//                                     </Link>
//                                   </li>
//                                 )}
//                               </React.Fragment>
//                             ))}
//                         </ul>
//                       </Collapse>
//                     </li>
//                   ) : null}
//                 </React.Fragment>
//               ))}
//             </SimpleBar>
//           </Container>
//         </div>
//       ) : (
//         <SimpleBar id="scrollbar" className="h-100">
//           <Container fluid>
//             <div id="two-column-menu"></div>
//             <ul className="navbar-nav" id="navbar-nav">
//               <VerticalLayout />
//             </ul>
//           </Container>
//         </SimpleBar>
//       )}
//     </>
//   );
// };

