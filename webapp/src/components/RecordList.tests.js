const assert = require('assert');
const RecordList = require('../RecordList');

// Describe la suite de pruebas para la clase RecordList
describe('RecordList', () => {
    // Define una prueba para el método addRecord
    it('should add a record to the list', () => {
        // Crea una instancia de la clase RecordList
        const recordList = new RecordList();

        // Agrega un registro a la lista
        recordList.addRecord('Record 1');

        // Verifica que el registro se haya agregado correctamente
        assert.strictEqual(recordList.records.length, 1);
        assert.strictEqual(recordList.records[0], 'Record 1');
    });

    // Define una prueba para el método removeRecord
    it('should remove a record from the list', () => {
        // Crea una instancia de la clase RecordList
        const recordList = new RecordList();

        // Agrega algunos registros a la lista
        recordList.addRecord('Record 1');
        recordList.addRecord('Record 2');
        recordList.addRecord('Record 3');

        // Elimina un registro de la lista
        recordList.removeRecord('Record 2');

        // Verifica que el registro se haya eliminado correctamente
        assert.strictEqual(recordList.records.length, 2);
        assert.strictEqual(recordList.records[0], 'Record 1');
        assert.strictEqual(recordList.records[1], 'Record 3');
    });

    // Define una prueba para el método getRecordCount
    it('should return the correct record count', () => {
        // Crea una instancia de la clase RecordList
        const recordList = new RecordList();

        // Agrega algunos registros a la lista
        recordList.addRecord('Record 1');
        recordList.addRecord('Record 2');
        recordList.addRecord('Record 3');

        // Obtiene el número de registros en la lista
        const recordCount = recordList.getRecordCount();

        // Verifica que el número de registros sea correcto
        assert.strictEqual(recordCount, 3);
    });

    // Define una prueba para el método clearRecords
    it('should clear all records from the list', () => {
        // Crea una instancia de la clase RecordList
        const recordList = new RecordList();

        // Agrega algunos registros a la lista
        recordList.addRecord('Record 1');
        recordList.addRecord('Record 2');
        recordList.addRecord('Record 3');

        // Limpia todos los registros de la lista
        recordList.clearRecords();

        // Verifica que la lista esté vacía
        assert.strictEqual(recordList.records.length, 0);
    });
});