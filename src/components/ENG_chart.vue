<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="12">
                <el-date-picker v-model="date_range" type="daterange" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                    start-placeholder="開始日期" range-separator="至" end-placeholder="結束日期" 
                    :picker-options="pickerOptions"  @change="CheckData"
                    size="large"/>
            </el-col>
        </el-row>
        <el-row>
            <el-card header="">
                <el-row>
                    <el-col :span="18">
                        <ve-histogram :data="lineChartData" :settings="chartSettings" />
                    </el-col>
                    <el-col :span="6">
                        <ve-ring :data="ringChartData" />
                    </el-col>                        
                </el-row>
            </el-card>
        </el-row>
    </div>
</template>

<script>
import * as moment from "moment/moment"
import {Toast} from "mand-mobile"

export default {
    name: "ENG_chart",
    components:
    {

    },
    props: 
    {
        isRefresh: Boolean,
    },
    data()
    {
        return {
            chartSettings: {
                stack: { '上料方式': ['手動', '自動'] }
            },
            list: [],
            loading: false,
            date_range: [],
            date_range_each_date: [],
            pickerOptions:
            {
                shortcuts: [ {
                text: '昨天',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24)
                    picker.$emit('pick', [start, end]) }
                }, {
                text: '一周前',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end]) }
                }, {
                text: '二周前',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
                    picker.$emit('pick', [start, end]) }
                }, {
                text: '三周前',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 21)
                    picker.$emit('pick', [start, end]) }
                }, {
                text: '四周前',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 28)
                    picker.$emit('pick', [start, end]) }
                }]
            },
            ringChartData:{},
            lineChartData: {}
        }
    },
    async created()
    {
        moment.locale("zh-tw")
        this.date_range.push(moment().subtract(7,'d').format('YYYY-MM-DD 00:00:00'))
        this.date_range.push(moment().format('YYYY-MM-DD 23:59:59'))
        await this.CheckData()
    },
    computed:
    {
    },
    watch:
    {
        date_range(value)
        {
            this.date_range_each_date = []
            let start = moment(value[0])
            let end = moment(value[1])
            while (start.isBefore(end))
            {
                this.date_range_each_date.push(start.format('YYYY-MM-DD'))
                start = start.add(1, 'd')
            }
        },
        async isRefresh(val)
        {
            if(val)
            {
                await this.CheckData()
                this.$emit('finishRefresh')
            }
        }
    },
    methods:
    {
        _ringChartData()
        {
            let row = [
                { "上料模式": "auto", "使用次數": 0},
                { "上料模式": "manual", "使用次數": 0}
            ]
            this._(this.list).forEach( element =>
            {
                for(let i=0; i<row.length; i++)
                {
                    if(element["load_mode"] == row[i]["上料模式"])
                    {
                        row[i]["使用次數"] = row[i]["使用次數"] + 1
                        break
                    }
                }
            })
            this.ringChartData = {
                columns: ['上料模式', '使用次數'],
                rows: row
            }
        },

        _lineChartData()
        {
            let data = []
            this.date_range_each_date.forEach( date =>
            {
                let total = 0
                let auto = 0
                let manual = 0
                this._(this.list).forEach( element =>
                {
                    if(moment(element["STARTDATETIME"]) >= moment(date) &&
                     moment(element["STARTDATETIME"]) <  moment(date).add(1,'d'))
                    {
                        total = total + 1
                        if(element["load_mode"] == "auto") //使用自動模式
                        {
                            auto = auto + 1
                        }
                        else if(element["load_mode"] == "manual")
                        {
                            manual = manual + 1
                        }
                    }
                })
                data.push({'日期': date, "手動": manual, "自動": auto})
                // console.log(moment(date).format('YYYY-MM-DD hh:mm:ss') + "-------" + moment(date).subtract(1,'d').format('YYYY-MM-DD hh:mm:ss'))
            })
            this.lineChartData = { columns: ['日期', '自動', '手動'], rows: data}
        },
        async getHistory(starttime, endtime)
        {
            let response = await this.$store.dispatch("_db", { 
                url: "_db/ENG-10/_api/cursor",
                method: "POST",
                payload: {
                    "query": "FOR doc IN ENG_HISTORY FILTER doc.`STARTDATETIME` > '" + starttime +"' AND  \
                     doc.`STARTDATETIME` < '" + endtime +"' SORT doc.STARTDATETIME DESC RETURN doc",
                    "count": true
                }
            })
            return response["result"]
        },
        async CheckData()
        {
            this.loading = true
            this.list = []
            let auto_data = await this.getHistory(this.date_range[0], this.date_range[1])
            this._(auto_data).forEach( ele =>
            {
                let x = {
                    "load_mode" : "auto",
                    "STARTDATETIME" : ele["STARTDATETIME"],
                }
                this.list.push(x)
            })
            await fetch("http://10.11.20.108:9999/api/HistroyHandle?start=" + this.date_range[0] + "&end=" + this.date_range[1],
            {
                method: "GET",
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                this._(response["result"]).forEach( ele =>
                {
                    for(let i=0; i<auto_data.length; i++)
                    {
                        if(ele["uid"] == auto_data[i]["uid"])
                        {
                            return
                        }
                    }
                    let x = {
                        "load_mode" : "manual",
                        "STARTDATETIME" : ele["datetime"],
                    }
                    this.list.push(x)
                })
                this._ringChartData()
                this._lineChartData()
            })
            .catch( err =>
            {
                this.$notify.warning({ title: 'Edge資料庫存取異常', message: err})
            })
            .finally( () =>
            {
                this.loading = false
                Toast.info("更新成功")
            })
        },
    }
}
</script>