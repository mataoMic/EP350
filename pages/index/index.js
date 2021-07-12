import bluetoothService, { BLUETOOTH_EVENT } from '../../services/bluetoothService';

const app = getApp()

Page({
  data: {

    devices: [],
  },
  async onLoad() {
    bluetoothService.on(BLUETOOTH_EVENT.DEVICE_FOUND, this.bluetoothDeviceFound);
    await bluetoothService.startDiscovery().catch(err => {
      console.error(err);
    });
  },
  async onUnload() {
    bluetoothService.off(BLUETOOTH_EVENT.DEVICE_FOUND, this.bluetoothDeviceFound);
    bluetoothService.off(BLUETOOTH_EVENT.DATA_RECEIVED, this.bluetoothNewData);
    bluetoothService.stopDiscovery().catch(console.error);
  },
  bluetoothDeviceFound(res) {
    console.log(res);
    this.setData({ devices: res });
  },
  bluetoothNewData(res) {
    console.log(res);
  },
  async connectDevice(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId

    const device = await bluetoothService.connect(deviceId)
      .catch(err => console.error(err));
    console.log(device);
  }
})
