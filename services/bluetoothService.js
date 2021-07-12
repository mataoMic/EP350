import { EventEmitter } from 'events';
import differenceBy from 'lodash.differenceby';

export const BLUETOOTH_EVENT = {
  DEVICE_FOUND: 'DEVICE_FOUND',
  DATA_RECEIVED: 'DATA_RECEIVED',
};

export class ConnectedDevice {

  connected = false;
  deviceId = '';
  serviceId = '';
  readCharacteristic = '';
  writeCharacteristic = '';
  notifyCharacteristic = '';

  get readable() {
    return this.connected && this.readCharacteristic;
  }
  get writable() {
    return this.connected && this.writeCharacteristic;
  }
  get notifiable() {
    return this.connected && this.notifyCharacteristic;
  }

  markAsConnected(
    deviceId,
    serviceId,
    readCharacteristic,
    writeCharacteristic,
    notifyCharacteristic,
  ) {
    this.connected = true;
    this.deviceId = deviceId;
    this.serviceId = serviceId;
    this.readCharacteristic = readCharacteristic;
    this.writeCharacteristic = writeCharacteristic;
    this.notifyCharacteristic = notifyCharacteristic;
  }

  markAsDisconnected() {
    this.connected = false;
  }

};

class BluetoothService extends EventEmitter {

  isOpened = false;
  isDiscovering = false;
  isDeviceFoundAttached = false;
  isReadAttacked = false;

  foundDevicesList = [];
  connectedDevice = new ConnectedDevice();

  async openBluetooth() {
    if (!this.isOpened) {
      await wx.openBluetoothAdapter();
      this.isOpened = true;
    }
  }

  async closeBluetooth() {
    if (this.isOpened) {
      await this.stopDiscovery();
      await wx.closeBluetoothAdapter();
      this.isOpened = false;
    }
  }

  async startDiscovery() {
    if (!this.isDiscovering) {
      await this.openBluetooth();
      await wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
      });
      this.isDiscovering = true;
      this.foundDevicesList = [];
    }

    if (!this.isDeviceFoundAttached) {
      wx.onBluetoothDeviceFound(({ devices  }) => {
        const newDevices = differenceBy(devices, this.foundDevicesList, 'deviceId');
        if (newDevices.length) {
          this.foundDevicesList.push(...newDevices);
        }
        this.emit(BLUETOOTH_EVENT.DEVICE_FOUND, this.foundDevicesList);
      });
      this.isDeviceFoundAttached = true;
    }
  }

  async stopDiscovery() {
    if (this.isDiscovering) {
      await wx.stopBluetoothDevicesDiscovery();
      this.isDiscovering = false;
    }
  }

  async connect(deviceId) {
    if (this.connectedDevice.connected) {
      await this.disconnect();
    }

    await wx.createBLEConnection({ deviceId });
    const { services } = await wx.getBLEDeviceServices({ deviceId });
    const serviceId = services.find(s => s.isPrimary)?.uuid;

    if (!serviceId) {
      throw new Error('no primary service');
    }

    const { characteristics } = await wx.getBLEDeviceCharacteristics({ deviceId, serviceId });
    const readable = characteristics.find(c => c.properties.read);
    const writable = characteristics.find(c => c.properties.write);
    const notifiable = characteristics.find(c => c.properties.notify || c.properties.indicate);

    if (readable) {
      wx.readBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId: readable.uuid,
      });
    }
    if (notifiable) {
      wx.notifyBLECharacteristicValueChange({
        deviceId,
        serviceId,
        characteristicId: notifiable.uuid,
        state: true,
      });
    }

    if (!this.isReadAttacked) {
      wx.onBLECharacteristicValueChange(({ characteristicId, value }) => {
        console.log(characteristicId, value);
        this.emit(BLUETOOTH_EVENT.DATA_RECEIVED, value);
      });
      this.isReadAttacked = true;
    }

    this.connectedDevice.markAsConnected(deviceId, serviceId, readable?.uuid, writable?.uuid, notifiable?.uuid);
    return this.connectedDevice;
  }

  async disconnect() {
    if (!this.connectedDevice.connected) {
      return;
    }

    await wx.closeBLEConnection({ deviceId: this.connectedDevice.deviceId });
    this.connectedDevice.markAsDisconnected();
  }

  async writeValue(value) {
    if (this.connectedDevice.connected && this.connectedDevice.writable) {
      wx.writeBLECharacteristicValue({
        characteristicId: this.connectedDevice.writeCharacteristic,
        deviceId: this.connectedDevice.deviceId,
        serviceId: this.connectedDevice.serviceId,
        value: value,
      });
    }
  }

}

export default new BluetoothService();
