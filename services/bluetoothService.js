import { EventEmitter } from 'events';

export const BLUETOOTH_EVENT = {
  DEVICE_FOUND: 'DEVICE_FOUND',
  DATA_RECEIVED: 'DATA_RECEIVED',
};
export const STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  DONE: 'DONE'
}

export class ConnectedDevice {

  deviceId = '';
  serviceId = '';
  readCharacteristic = '';
  writeCharacteristic = '';
  notifyCharacteristic = '';

  markAsConnected(
    deviceId,
    serviceId,
    readCharacteristic,
    writeCharacteristic,
    notifyCharacteristic,
  ) {
    this.deviceId = deviceId;
    this.serviceId = serviceId;
    this.readCharacteristic = readCharacteristic;
    this.writeCharacteristic = writeCharacteristic;
    this.notifyCharacteristic = notifyCharacteristic;
  }

};

class BluetoothService extends EventEmitter {

  isOpened = false;
  isDiscovering = false;
  connectStatus = STATUS.IDLE;

  isDeviceFoundAttached = false;
  isReadAttached = false;

  foundDevicesList = [];
  connectedDevice = new ConnectedDevice();

  get connected() {
    return this.connectStatus === STATUS.DONE;
  }
  get readable() {
    return this.connected && this.connectedDevice.readCharacteristic;
  }
  get writable() {
    return this.connected && this.connectedDevice.writeCharacteristic;
  }
  get notifiable() {
    return this.connected && this.connectedDevice.notifyCharacteristic;
  }

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
        devices.forEach(d => {
          const idx = this.foundDevicesList.findIndex(fd => fd.deviceId === d.deviceId);
          if (idx === -1) {
            this.foundDevicesList.push(d);
          } else {
            this.foundDevicesList[idx] = d;
          }
        });
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
    if (this.connectStatus === STATUS.PENDING) {
      throw new Error('another connection is in progress.');
    }

    this.connectStatus = STATUS.PENDING;
    try {
      if (this.connected) {
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

      if (!this.isReadAttached) {
        wx.onBLECharacteristicValueChange(({ characteristicId, value }) => {
          console.log(characteristicId, value);
          this.emit(BLUETOOTH_EVENT.DATA_RECEIVED, value);
        });
        this.isReadAttached = true;
      }

      this.connectStatus = STATUS.DONE;
      this.connectedDevice.markAsConnected(deviceId, serviceId, readable?.uuid, writable?.uuid, notifiable?.uuid);
    } catch(err) {
      this.connectStatus = STATUS.IDLE;
      throw err;
    }

    return this.connectedDevice;
  }

  async disconnect() {
    if (!this.connected) {
      return;
    }

    await wx.closeBLEConnection({ deviceId: this.connectedDevice.deviceId });
    this.connectedDevice.markAsDisconnected();
  }

  async writeValue(value) {
    if (this.writable) {
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
