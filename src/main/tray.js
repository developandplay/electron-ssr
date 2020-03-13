import { Menu, nativeImage, Tray } from 'electron'
import { appConfig$ } from './data'
import * as handler from './tray-handler'
import { checkUpdate } from './updater'
import { groupConfigs } from '../shared/utils'
import { isMac, isOldMacVersion, isWin } from '../shared/env'
import { disabledTray, enabledHighlightTray, enabledTray, globalHighlightTray, globalTray, pacHighlightTray, pacTray } from '../shared/icon'
import { i18n } from '../translation/i18n'

let tray

/**
 * 生成服务器子菜单
 * @param {*Array<Object>} configs ssr配置集合
 * @param {*Number} selectedIndex 选中的ssr配置的索引
 */
function generateConfigSubmenus (configs, selectedIndex) {
  const groups = groupConfigs(configs, selectedIndex)
  const submenus = Object.keys(groups).map(key => {
    const groupedConfigs = groups[key]
    return {
      label: `${groupedConfigs.some(config => config.checked) ? '● ' : ''}${key}`,
      submenu: groupedConfigs.map(config => {
        return {
          id: config.id,
          label: `${config.remarks}(${config.server}:${config.server_port})`,
          type: 'checkbox',
          checked: config.checked,
          click (e) {
            const index = configs.findIndex(config => config.id === e.id)
            if (index === selectedIndex) {
              // 点击的是当前节点
              e.checked = true
            } else {
              handler.switchConfig(configs.findIndex(config => config.id === e.id))
            }
          }
        }
      })
    }
  })
  if (!configs || !configs.length) {
    submenus.push({ label: 'none', enabled: false })
  }
  submenus.push({ type: 'separator' })
  submenus.push({ label: i18n.__('Edit connection'), click: handler.showManagePanel })
  submenus.push({ label: i18n.__('Manage subscription'), click: handler.showSubscribes })
  submenus.push({ label: i18n.__('Update subscription'), click: handler.updateSubscribes })
  return submenus
}

/**
 * 根据应用配置生成菜单
 * @param {Object} appConfig 应用配置
 */
function generateMenus (appConfig) {
  const base = [
    { label: i18n.__('Connection manager'), click: handler.showManagePanel },
    { label: i18n.__('Proxy enabled'), type: 'checkbox', checked: appConfig.enable, click: () => {
      handler.toggleEnable()
      handler.toggleProxy(appConfig.sysProxyMode)
    } },
    { label: i18n.__('PAC'), submenu: [
      { label: i18n.__('Update PAC'), click: handler.updatePac }
    ] },
    { label: i18n.__('Server'), submenu: generateConfigSubmenus(appConfig.configs, appConfig.index) },
    { label: i18n.__('Scan QR code'), click: handler.scanQRCode },
    { label: i18n.__('Configuration'), submenu: [
      { label: i18n.__('General settings'), click: handler.showOptions },
      { label: i18n.__('Import gui-config.json'), click: handler.importConfigFromFile },
      { label: i18n.__('Export gui-config.json'), click: handler.exportConfigToFile },
      { label: i18n.__('Import from clipboard'), click: handler.importConfigFromClipboard },
      { label: i18n.__('Open gui-config.json'), click: handler.openConfigFile }
    ] },
    { label: i18n.__('Copy proxy settings'), click: handler.copyHttpProxyCode },
    { label: i18n.__('Help'), submenu: [
      { label: i18n.__('Updates'), click: () => checkUpdate(true) },
      { label: i18n.__('Log'), click: handler.openLog },
      // { label: '项目主页', click: () => { handler.openURL('https://github.com/shadowsocksrr/electron-ssr') } },
      // { label: 'Bug反馈', click: () => { handler.openURL('https://github.com/shadowsocksrr/electron-ssr/issues') } },
      // { label: '捐赠', click: () => { handler.openURL('https://github.com/erguotou520/donate') } },
      { label: i18n.__('Developer tools'), click: handler.openDevtool }
    ] },
    { label: i18n.__('Quit'), click: handler.exitApp }
  ]
  if (!isOldMacVersion) {
    base.splice(1, 0,
      { label: i18n.__('Proxy mode'), submenu: [
        { label: i18n.__('Disable proxy'), type: 'checkbox', checked: appConfig.sysProxyMode === 0, click: e => changeProxy(e, 0, appConfig) },
        { label: i18n.__('PAC proxy'), type: 'checkbox', checked: appConfig.sysProxyMode === 1, click: e => changeProxy(e, 1, appConfig) },
        { label: i18n.__('Global proxy'), type: 'checkbox', checked: appConfig.sysProxyMode === 2, click: e => changeProxy(e, 2, appConfig) }
      ] }
    )
  }
  return base
}

// 切换代理
export function changeProxy (e, mode, appConfig) {
  if (mode === appConfig.sysProxyMode) {
    e.checked = true
  } else {
    handler.toggleProxy(mode)
  }
}

// 根据配置显示tray tooltip
function getTooltip (appConfig) {
  if (!appConfig.enable) {
    return 'ShadowsocksR客户端：应用未启动'
  }
  const arr = []
  if (appConfig.enable) {
    arr.push('ShadowsocksR客户端：应用已启动\n')
  }
  arr.push('代理启动方式：')
  if (appConfig.sysProxyMode === 0) {
    arr.push('未启用代理')
  } else if (appConfig.sysProxyMode === 1) {
    arr.push('PAC代理')
  } else if (appConfig.sysProxyMode === 2) {
    arr.push('全局代理')
  }
  const selectedConfig = appConfig.configs[appConfig.index]
  if (selectedConfig) {
    arr.push('\n')
    arr.push(`${selectedConfig.group ? selectedConfig.group + ' - ' : ''}${selectedConfig.remarks || (selectedConfig.server + ':' + selectedConfig.server_port)}`)
  }
  return arr.join('')
}

/**
 * 更新任务栏菜单
 * @param {Object} appConfig 应用配置
 */
function updateTray (appConfig) {
  const menus = generateMenus(appConfig)
  const contextMenu = Menu.buildFromTemplate(menus)
  tray.setContextMenu(contextMenu)
  tray.setToolTip(getTooltip(appConfig))
}

// 根据应用状态显示不同的图标
function setTrayIcon (appConfig) {
  if (appConfig.enable) {
    if (appConfig.sysProxyMode === 1) {
      tray.setImage(pacTray)
      isMac && tray.setPressedImage(pacHighlightTray)
    } else if (appConfig.sysProxyMode === 2) {
      tray.setImage(globalTray)
      isMac && tray.setPressedImage(globalHighlightTray)
    } else {
      tray.setImage(enabledTray)
      isMac && tray.setPressedImage(enabledHighlightTray)
    }
  } else {
    tray.setImage(disabledTray)
    isMac && tray.setPressedImage(disabledTray)
  }
}

/**
 * 渲染托盘图标和托盘菜单
 */
export default function renderTray (appConfig) {
  // 生成tray
  tray = new Tray(nativeImage.createEmpty())
  updateTray(appConfig)
  setTrayIcon(appConfig)
  tray.on((isMac || isWin) ? 'double-click' : 'click', handler.showMainWindow)
}

/**
 * 销毁托盘
 */
export function destroyTray () {
  if (tray) {
    tray.destroy()
  }
}

// 监听数据变更
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  if (!changed.length) {
    renderTray(appConfig)
  } else {
    if (['configs', 'index', 'enable', 'sysProxyMode'].some(key => changed.indexOf(key) > -1)) {
      updateTray(appConfig)
    }
    if (['enable', 'sysProxyMode'].some(key => changed.indexOf(key) > -1)) {
      setTrayIcon(appConfig)
    }
  }
})
