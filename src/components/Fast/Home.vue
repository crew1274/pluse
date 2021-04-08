<template>
    <div>
        <div v-if="stage == 1">
            <el-row :gutter="10">
                <el-col :span="16" :offset="4">
                    <md-field title="輸入生產資訊" brief="RFID感應工單、識別證可自動帶入">
                        <md-input-item title="批號:" placeholder="支援手動輸入" is-highlight v-model="lot"
                        clearable @click.native="openDialog('lot')"/>
                        <md-input-item title="工號:" placeholder="支援手動輸入" is-highlight maxlength=6 v-model="operator"
                        clearable @click.native="openDialog('operator')"/>
                        <md-input-item title="前重:" placeholder="請手動輸入" is-highlight v-model="before_weight"
                        clearable @click.native="openDialog('before_weight')"/>
                        <md-input-item title="後重:" placeholder="請手動輸入" is-highlight v-model="after_weight"
                        clearable @click.native="openDialog('after_weight')"/>
                        <md-radio-group v-model="process">
                            <md-radio-box name="PTH">低應力化銅前</md-radio-box>
                            <md-radio-box name="STRIP">內層檢修前</md-radio-box>
                            <md-radio-box name="ENG">外層(有鍍金)</md-radio-box>
                        </md-radio-group>
                    </md-field>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10">
                    <md-field title="">
                        <md-detail-item title="weight loss:" :content="recipe.weight_loss" />
                        <md-detail-item title="咬蝕厚度:" :content="recipe.etching_thickness"  />
                        <md-detail-item title="槽長:" :content="recipe.tank_length"  />
                        <md-detail-item title="反應時間:" :content="recipe.reaction_time"  />
                        <md-detail-item title="Etching Rate:" :content="recipe.etching_rate" />
                        <md-detail-item title="線速:" :content="recipe.speed" />
                        <md-detail-item title="咬蝕量:" :content="recipe.etching_amount" />
                    </md-field>
                </el-col>
                <el-col :span="14">
                    <md-field title="計算結果">
                        <!-- <md-input-item title="蝕光面銅:" :value="result.a" @click.native="openDialog('result.a')" 
                        clearable align="right" :error="isValidMsg.a" :disabled="isOverWrite" />
                        <md-input-item title="去膜後蝕刻:" :value="result.b" @click.native="openDialog('result.b')" 
                        clearable align="right" :error="isValidMsg.b" :disabled="isOverWrite" />
                        <md-input-item title="鍍金後去膜蝕刻:" :value="result.c" @click.native="openDialog('result.c')"
                        clearable align="right" :error="isValidMsg.c" :disabled="isOverWrite" />
                        <md-input-item title="PTH重工蝕刻:" :value="result.d" @click.native="openDialog('result.d')"
                        clearable align="right" :error="isValidMsg.d" :disabled="isOverWrite"/> -->
                        <!-- <md-detail-item title="蝕光面銅:" :content="result.a" bold /> -->
                        <md-detail-item title="低應力化銅前:" :content="result.a" :bold="process== 'PTH'" />
                        <md-detail-item title="內層檢修前:" :content="result.b" :bold="process== 'STRIP'" />
                        <md-detail-item title="外層(有鍍金):" :content="result.c" :bold="process== 'ENG'" />
                    </md-field>
                    
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <center>
                    <div v-show="errMsg" class="errMsg">
                        {{errMsg}}
                    </div>
                </center>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8" :offset="4">
                    <md-button type="warning" @click="clean" icon="delete">清空/取消</md-button>
                </el-col>
                <el-col :span="8">
                    <md-button type="primary" @click="prepare" icon="right">投料</md-button>
                </el-col>
            </el-row>
        </div>
        <md-landscape v-model="isDone">
            <img :src="celebrate">
            <span id="d">操作完成，點選跳回上一頁</span>
        </md-landscape>
        <md-landscape v-model="isFailed">
            <img :src="failed">
            <span id="d">啟動失敗，請查看詳細原因</span>
        </md-landscape>
        <md-dialog title="" v-model="editDialog.open">
            <div style="height:600px">
                <md-scroll-view auto-reflow :scrolling-x="false">
                    <md-input-item title="修改值:" v-model="editDialog.target" :solid="false" />
                    <md-input-item title="覆寫值:" v-model="editDialog.overwrite" :solid="false" >
                        <div slot="right">
                            <span @click="doPaste()">貼上</span>
                        </div>
                    </md-input-item>
                    <md-number-keyboard v-model="editDialog.isNumberShow" ok-text="確認" :text-render="keyFormatter"
                    @enter="editDialogEnter" @delete="editDialogDelete" @confirm="editDialogConfirm" is-view />
                    <md-field-item title="特殊字元">
                        <md-radio name="." v-model="keyBoardRender" label="." inline />
                        <md-radio name="-" v-model="keyBoardRender" label="-" inline />
                        <md-radio name="_" v-model="keyBoardRender" label="_" inline />
                    </md-field-item>
                </md-scroll-view>
            </div>
        </md-dialog>

        <!-- <md-popup v-model="isDone" position="center" :mask-closable="false">
            <div class="c">
                <center>生產中...</center>
                <el-button type="warning" @click="stop" >停止滾輪</el-button>
            </div>
        </md-popup> -->
    </div>
</template>

<script>
import { Button, Toast, NumberKeyboard, Field, FieldItem, InputItem, Dialog, Switch, DetailItem, ActivityIndicator
        ,RadioBox, RadioGroup, Radio, ScrollView, Skeleton, Landscape, Popup, PopupTitleBar} from "mand-mobile"

export default {
  name: "Home",
  components: {
    [Button.name]: Button,
    [ActivityIndicator.name]: ActivityIndicator,
    [Popup.name]: Popup,
    [PopupTitleBar.name]: PopupTitleBar,
    [Landscape.name]: Landscape,
    [ScrollView.name]: ScrollView,
    [Switch.name]: Switch,
    [Field.name]: Field,
    [InputItem.name]: InputItem,
    [NumberKeyboard.name]: NumberKeyboard,
    [Dialog.name]: Dialog,
    [DetailItem.name]: DetailItem,
    [RadioBox.name]: RadioBox,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [FieldItem.name]: FieldItem,
    [Skeleton.name]: Skeleton,
  },
  props:
  {
        isRefresh: Boolean,
  },
  data() 
  {
    return {  
        celebrate: require("@/assets/celebrate.png"),
        failed: require("@/assets/failed.png"),
        isDone: false,
        isFailed: false,
        isLock: false,
        isOverWrite: false,
        keyBoardRender: ".",
        stage: 1,
        errMsg: "",
        isPopupShow: true,
        editDialog:
        {
          open: false, // 控制開關
          target: "", // 目標值
          target_key: "",
          overwrite: "", // 覆寫值
          isNumberShow: true,
          btns: [
            {
              text: '取消',
              warning : true,
            },
          ],
        },
        mode: "自動計算",
        lot: "",
        operator: "",
        procseq: "",
        process: "",
        before_weight: "",
        after_weight: "",
        payload:
        {
            mfdata:
            {
                lotdata:
                {
                    no: null,
                    procseq: null
                }
            }
        },
        lotdata:
        {
            itemno: null,
            itemver: null,
            mfver: null,
            no: null,
            procseq: null,
        },
        procdata:
        {
            procname: null,
            procprams: 
            {
              procpram: []
            },
        },
      }
    },
    computed:
    {
        redis_msg()
        {
            return this.$store.state.redis_msg
        },
        isValid()
        {
            return  ! Object.values(this.isValidMsg).every( x => (x === ""))
        },
        isValidMsg()
        {
            return ""
        },
        recipe()
        {
            let tmp = {}
            // weight_loss 
            // etching_thickness
            // tank_length
            // reaction_time
            // etching_rate
            // speed
            // etching_amount
            tmp.weight_loss = Math.round( (this.before_weight - this.after_weight)  *1000 ) / 1000
            tmp.etching_thickness =  Math.round(tmp.weight_loss / 8.96 / 11 / 11 * 10000 * 10000 ) / 10000
            tmp.tank_length = 1
            tmp.reaction_time = 60
            tmp.etching_rate =  Math.round( tmp.etching_thickness / 60 / 2 * 10000  ) / 10000
            tmp.speed = 1
            tmp.etching_amount = Math.round( 60 * tmp.etching_rate * 1000) / 1000
            return tmp
        },
        result()
        {
            let temp = {}
            temp.a = Math.round( this.recipe.etching_amount / 1.25 * 100) / 100
            temp.b = Math.round( this.recipe.etching_amount / 0.9 * 100) / 100
            temp.c = Math.round( this.recipe.etching_amount / 0.3 * 100) / 100
            return temp
        },
        getWSmessage()
        {
            console.log(this.$store.state._ws_back)
            return this.$store.state._ws_back
        },   
    },
    watch:
    {
        async isRefresh(val)
        {
            if(val)
            {
                this.$emit('finishRefresh')
            }
        },
        // isValidMsg:
        // {
        //     handler: function (val)
        //     {
        //         let r = false
        //         Object.keys(val.forEach( (k) =>
        //         {
        //             r = (r || !!val[k])
        //         }))
        //         this.isValid = r
        //     },
        //     deep: true
        // },
        redis_msg(value)
        {
            let val = value['msg']

            if(this.stage == 1)
            {
                if(val["target"].length < 8)
                {
                    Toast.info("RFID讀取到工號:" + val["target"])
                    this.operator = val["target"]
                }
                else
                {
                    Toast.info("RFID讀取到批號:" + val["target"])
                    this.lot = val["target"]
                }
            }
        },
        getWSmessage(value)
        {
            if("type" in value)
            {
                if(value["type"] == "operator")
                {
                    Toast.info("RFID讀取到工號:" + value["target"])
                    this.operator = value["target"]
                }
                else if(value["type"] == "lot")
                {
                    Toast.info("RFID讀取到批號:" + value["target"])
                    this.lot = value["target"]
                    this.getProcess()
                }
            }
        },
    },
    async beforeCreate()
    {
    },
    async created()
    {
        // this.lot = "2021010138-6-1-0"
        // this.getProcess()
    },
    async beforeMount()
    {

    },
    activated()
    {
        //切換WEBSOCKET網址
        this.$store.dispatch('_ws_close')
        this.$store.dispatch('_ws_login', {"User": "遠端帳號", "Password": "171104", "target": "ws://10.11.20.133:9999"})
    },
    async mounted()
    { 
        this.spec = this.$store.state.spec
    },
    async beforeDestroy()
    {
        // let tmep = {}
        // Object.keys(this.$data).forEach(key =>
        // {
        //     tmep[key] = this.$data[key]
        // })
        // this.$store.commit('store_prod_state', tmep)
    },
    async destroy()
    {

    },
    methods:
    {
        doPaste()
        {
            navigator.clipboard.readText()
            .then( text =>
            {
                this.editDialog.overwrite = text
                Toast.succeed("貼上:" + text)
            })
        },
        getProcess()
        {
            fetch("http://10.11.20.133:9999/api/getProcess/" + this.lot,
            {
                method: "GET",
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"] )
                {
                    throw "需手動選擇製程!"
                }
                if(response["response"] == "NONE")
                {
                    throw "需手動選擇製程!"
                }
                else
                {
                    this.process = response["response"]
                }
            })
            .catch( err =>
            {
                this.errMsg = err
                // this.isFailed = true
            })
        },
        async predict()
        {
            this.$store.commit('update_isLoading', true)
            await fetch("http://mesap/Report/RunCard/Admin/2021010789-1-1-1",
            {
                method: "GET",
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                console.log(response)
            })
            .catch( err =>
            {
                this.errMsg = err
                this.isFailed = true
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        },
        async prod()
        {
            this.$store.commit('update_isLoading', true)
            this.errMsg = ""
            // 生成uid
            let uid =  Math.floor(Math.random() * 1024) + 1
            await fetch('http://10.11.20.133:9999/api/prepare',
            {
                method: "POST",
                body: JSON.stringify({
                        uid : uid,
                        recipe: this.recipe,
                        result: this.result,
                        lot: this.lot,
                        operator: this.operator,
                        process: this.process,
                        before_weight: this.before_weight,
                        after_weight: this.after_weight
                    })
            })
            .then( response => {return response.json()})
            .then( response =>
            {
                if(response["Exception"])
                {
                    throw response["Exception"]
                }
                Toast.succeed("投料成功")
                this.isDone = true
            })
            .catch( err =>
            {
                this.errMsg = err
                this.isFailed = true
            })
            .finally( () =>
            {
                this.$store.commit('update_isLoading', false)
            })
        },

        editDialogEnter(val)
        {
            Toast({ content: val, position: 'top', duration: 1000})
            this.editDialog.overwrite += val
        },

        editDialogDelete()
        {
            if (this.editDialog.overwrite === '')
            {
                return
            }
            this.editDialog.overwrite = this.editDialog.overwrite.substr(0, this.editDialog.overwrite.length - 1)
        },

        editDialogConfirm()
        {
            Toast({ content: this.editDialog.target + "->" + this.editDialog.overwrite,
                position: 'top', duration: 2000, icon: 'edit' })
            this.editDialog.open = false
            this._.set(this.$data, this.editDialog.target_key, this.editDialog.overwrite)
        },

        openDialog(target)
        {
            this.editDialog.target_key = target.split('.')
            // this.editDialog.target = undefined
            // this._(this.editDialog.target_key).forEach( (value) =>
            // {
            //     this.editDialog.target ? 
            //         this.editDialog.target = this.editDialog.target[value] :
            //         this.editDialog.target = this.$data[value]
            // })
            this.editDialog.target = this._.get(this.$data, this.editDialog.target_key)
            this.editDialog.open = true
            this.editDialog.overwrite = ""
        },
        keyFormatter(val)
        {
            if (val === '.')
            {
                return this.keyBoardRender
            }
        },
        async prepare()
        {
            if(this.lot == "" || this.operator == "" )
            {
                Toast.failed('請輸入批號/工號')
                return
            }  
            if(this.process == "")
            {
                Toast.failed('請選擇製程')
                return
            }
            await this.prod()
        },
        clean()
        {
            this.lot = ''
            this.operator = ''
            this.process = ''
            this.before_weight = ''
            this.after_weight = ''
        },
    }
}
</script>

<style scoped>
.el-row
{
    margin-bottom: 20px;
}
.c
{
    height: 200px;
    width: 200px;
    background-color:antiquewhite
}
.errMsg
{
    font-size: 36px;
    color: #f54838;
}
.dialog
{
    height: 650px;
}
</style>