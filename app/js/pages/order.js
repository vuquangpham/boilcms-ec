class Order{
    constructor(wrapper){
        this.wrapper = wrapper;
        this.API_TOKEN = 'ce41f36c-6e53-11ed-b190-ea4934f9883e';

        // vars
        this.GHN_DATA = {};
        this.easySelect = {};

        this.init();
    }

    fetch(url, data = {}){
        return window.fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "token": this.API_TOKEN
            },
            ...data
        });
    }

    getProvinces(){
        const url = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province';
        return this.fetch(url);
    }

    loadDataToES(es, data, valueProperty = "ProvinceID", value = "ProvinceName"){
        const rawSelect = es.selectTag;
        rawSelect.innerHTML = data.map(d => {
            return `<option value="${d[valueProperty]}">${d[value]}</option>`;
        }).join();
        es.refresh();
    }

    loadDistrict(provinceId){
        const url = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district';
        return this.fetch(url, {
            method: "POST",
            body: JSON.stringify({province_id: parseInt(provinceId)})
        });
    }

    loadWarp(districtId){
        const url = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';
        return this.fetch(url, {
            method: "POST",
            body: JSON.stringify({district_id: parseInt(districtId)})
        });
    }

    handleProvinceDataChange(self){
        // load the district
        const provinceId = self.instance.value;
        this.loadDistrict(provinceId)
            .then(res => res.json())
            .then(result => {
                this.loadDataToES(this.easySelect.districtSelect, result.data, 'DistrictID', 'DistrictName');
            });
    }

    handleDistrictDataChange(self){
        // load the warp
        const warpId = self.instance.value;
        this.loadWarp(warpId)
            .then(res => res.json())
            .then(result => {
                this.loadDataToES(this.easySelect.wardSelect, result.data, 'WardCode', 'WardName');
            });
    }

    handleWarpChange(){
        // calculate shipping fee
    }

    initES(){
        // province
        const provinceSelect = this.wrapper.querySelector('[data-province-select]');
        this.getProvinces()
            .then(res => res.json())
            .then(result => {
                this.GHN_DATA.provinces = result.data;
            })
            .then(_ => {
                provinceSelect.innerHTML = this.GHN_DATA.provinces.map(d => {
                    return `<option value="${d.ProvinceID}">${d.ProvinceName}</option>`;
                }).join('');

                // init province select
                EasySelect.init(provinceSelect, {
                    id: 'province-select',
                    search: true,

                    // event
                    onInit: this.handleProvinceDataChange.bind(this),
                    onChange: this.handleProvinceDataChange.bind(this),
                });
                this.easySelect.provinceSelect = EasySelect.get('province-select');
            });

        // district select
        const districtSelect = this.wrapper.querySelector('[data-district-select]');
        EasySelect.init(districtSelect, {
            id: 'district-select',

            // on change and refresh event
            onChange: this.handleDistrictDataChange.bind(this),
            onRefresh: this.handleDistrictDataChange.bind(this)
        });
        this.easySelect.districtSelect = EasySelect.get('district-select');

        // ward select
        const wardSelect = this.wrapper.querySelector('[data-ward-select]');
        EasySelect.init(wardSelect, {
            id: 'ward-select',

            // events
            onChange: this.handleWarpChange.bind(this),
            onRefresh: this.handleWarpChange.bind(this)
        });
        this.easySelect.wardSelect = EasySelect.get('ward-select');
    }

    init(){
        // init Easy Select
        this.initES();
    }

}

document.querySelectorAll('.order-page').forEach(wrapper => new Order(wrapper));