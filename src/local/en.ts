export const en = {
    label: 'English',
    go_home: 'Go Home',
    go_account_manage: 'Back Account Manage',
    login_account: 'Test Login account',
    ws: {
        error: 'WS has been disconnected, please refresh the website.',
        error_reconn_r: 'WS attempting to reconnect',
        error_reconn: 'the WS connection has been disconnect, trying to reconnect',
        error_reconn_t: 'the WS connection has been disconnect, reconnect after {0} second',
    },
    game: {
        restart: {
            success: 'Account {0} restart successfully~',
        },
        setting: {
            reset_title: 'reset user settings',
            reset_confirm: 'This operation will restore your settings to the initialization state and cannot be restored.',
            reset_btn: 'confirm reset {0}',
            get_success: 'Account {0} setting get successful',
            set_success: 'Account {0} settings saved successfully',
            reset_success: 'Account {0} settings reset successfully',
            game_not_init: 'SetErr：Account {0} not init',
            game_not_exist: 'SetErr：Account {0} doesn\'t exist',
        },
        plan_recruit: {
            success_all: 'Recruit start successfully'
        },
        operation: {
            plan_all_recruit: 'Auto start all recruits',
            get_fr_clue: 'get clues from friend',
            start_info_share: 'put on clues&try start clue communicate',
            try_buy_social_good: 'Buy credit store items',
            mission_submit_daily: 'Submit daily task',
            mission_submit_weekly: 'Submit weekly task',
            force_build_reschedule: 'force build reschedule',
            mail_recv_all: 'receive all mails',
            quickacs: {
                tbs_suc: 'Run CMD:try buying credit store items',
                sis_suc: 'Run CMD:try start clue communicate',
                gfc_suc: 'Run CMD:get friend clues',
                sad_suc: 'Run CMD:Submit daily task',
                saw_suc: 'Run CMD:Submit weekly task',
                fbr_suc: 'Run CMD:force build reschedule',
                ram_suc: 'Run CMD:receive all mails',
            },
            recruit: {
                inst_success: 'the current recruit slot is completed ~',
                inst_err: 'current recruit slot acceleration failed!',
                fin_success: 'recruitment complete~',
                fin_err: 'recruitment error!',
                stop_success: 'recruitment stop completed',
                stop_err: 'StopErr：recruit slot already stopped or not start',
                sel_success: 'the current recruit slot tag selection is completed ~',
                sel_err: 'wrong tag selection for current recruit slot!',
                ref_state_fail: 'current recruit slot refresh failed (abnormal slot status)!',
                ref_success: 'refresh the current recruit slot ~',
                ref_err: 'current recruit slot refresh error!',
            },
            building: {
                buy_labor_success: 'building buy labor successfully',
                buy_labor_err: 'building buy labor wrongly',
                sync_success: 'building sync successfully',
                sync_err: 'building sync wrongly',
            },
        },
        act: {
            easy_acs: 'Quick Access',
            recruit: 'Recruit',
            building: 'Building',
            friend: 'Friends',
            mail: 'Mails',
            about: 'About',
            activity: 'Activity',
            aa: 'TND'
        },
        anal: {
            gamedata: 'GameData',
            wealth: 'Wealth',
            building: 'Building',
            gacha: 'Gacha',
            troop: 'Troops',
            dungeon: 'Dungeon',
            about: 'About',
            btn: {
                refresh: 'Refresh',
                get_all: 'Get All',
                get: 'Get',
                dump: 'Dump',
            },
        },
        create: {
            user_not_exist: 'what are you doing?',
            account_exist: 'game account {0} already exist!',
            account_exist_other: 'game account {0} already exist in!',
            account_running: 'game account {0} has already been created!',
            success: 'game account {0} created success!'
        },
        delete: {
            acc_not_exist: 'DeleteErr:Account {0} doesn\'t exist',
            game_not_exist: 'DeleteErr:Account {0} doesn\'t exist',
            success: 'Delete Account {0} Success',
            running: 'DeleteErr:Account {0} is running，please stop it first'
        },
        start: {
            success: 'Account {0} Hosting opened successfully',
            game_not_exist: 'OpenErr：Account {0} doesn\'t exist',
            game_already_start: 'OpenErr：Account Hosting {0} in running'
        },
        stop: {
            success: 'Account {0} 托管关闭成功',
            game_not_exist: 'CloseErr：Account {0} doesn\'t exist',
            game_not_start: 'CloseErr：Account {0} not in running'
        },
        info: {
            game_not_exist: 'GetAccountInfoErr: Account {0} doesn\'t exist',
            game_not_start: 'GetAccountInfoErr: Account {0} not in running',
            game_not_init: 'GetAccountInfoErr: Account {0} not init',
            success: {
                get_info: 'GetAccountInfo Success',
            },
            execute: {
                success: 'Command {0} execute success',
                finish: 'Command {0} execute finished',
                game_not_exist: 'Command {0} execute failed：Account not in running or not exist',
            },
            usercard: 'User Card',
            alerts: 'Alerts',
            current_ap: 'Current AP(Max',
            recruit_inuse: 'RecruitSlot InUse',
            campagn: 'Remain Champ.',
            info_share: 'Current Communicate State'
        },
        alert: {
            train_finish: 'Your character training is finished, please remember to check',
            lgacha_dfree: 'You have a free draw out that hasn\'t been used yet, please use it in time!',
            has_mail: 'You have a new mail, please remember to check',
            has_friend_request: 'You have a new friend application, please remember to check',
            ap: 'There is too much AP left today. Please deal with it in time. Don\'t waste it!',
            monthly_sub: 'Your monthly submit will expire on {0}.',
            game_failed: 'The current login has expired (remote login), please close and reopen it!',
            campaign: 'You still haven\'t obtained {0} Diam. in the operation this week. Don\'t miss it',
            info_share: 'You have met the conditions for starting communication.',
            recruit_finish: 'You have {0} recruitment completed. Remember to hire in time~',
            mission_d: 'You haven\'t finished all your tasks today. You can\'t rest yet~',
            mission_w: 'Your tasks have not been completed this week. Please check and complete them in time',
        }
    },
    account: {
        welcome: 'Welcome To Project AOP, Dr.{0}',
        current: 'Current game account',
        inrunning: 'Account in running',
        user_level: 'Account Level',
        game_account: 'Game Account List',
        name: 'name',
        account: 'account',
        platform: 'platform',
        status: 'status',
        operation: 'operation',
        refresh_monitor: 'Refresh monitor',
        logger: 'latest log',
        change_type: 'swich monitor',
        create_account: 'create',
        reload_account: 'sync',
        sync_success: 'Successfully synchronized {0} account information',
        create_btn: 'Create',
        create_welcome: 'Welcome to create a new game account',
        create_account_empty: 'Empty field in form：{0}',
        delete_btn: 'Delete',
        delete_deny: 'Cancel',
        delete_confirm: 'Warning: deletion will not be recoverable, and all account records and account information will be cleared!',
        delete_title: 'Confirm delete {0}',
        stop_all_account: 'stop all',
        stop_all_account_success: 'Stop All Account Successfully',
        tabs: {
            info: 'BaseInfo',
            setting: 'Settings',
            inventory: 'Inventory',
            troop: 'Troops',
            analytics: 'Analytics',
            operation: 'Operation',
            logger: 'Logs',
            terminal: 'Terminal',
            schedule: 'Schedule',
        },
    },
    logger: {
        time: 'Time',
        level: 'Level',
        info: 'Info',
    },
    login: {
        error: {
            password_empty: 'Password cannot be empty',
            username_empty: 'Username cannot be empty',
            nickname_empty: 'Nickname cannot be empty',
        },
        notice_reg: 'Or',
        forget: 'Forget Password',
        switch_serv: 'Switch Serv',
        title: 'User Login',
        username: 'User Name',
        password: 'Password',
        nickname: 'Nickname',
        login: 'Login',
        register: 'Register',
        auth_fail: 'Authorization Failed!',
        banned: 'The account has been banned',
        success: 'Welcome back, Dr.{0}~',
    },
    register: {
        title: 'User Register',
        notice: 'The current mode is invitation system. Please ask the administrator for the invitation code.',
        username: 'User Name',
        password: 'Password',
        invitecode: 'Invite Code',
        register: 'Register',
        success: 'Congratulations, registration successful~',
        back_login: '< Back Login'
    },
    theme: {
        language: 'Language',
        setting: 'Theme Settings',
        color_opt: 'Color Options',
        dark_mode: 'Theme Mode',
        server: 'Server Options',
        background: 'Background Settings',
        background_change: 'Switch Background',
        opacity: 'Opacity Setting',
    },
    rule: {
        required: 'field {0} is required'
    },
    error: {
        data_not_up_to_date: 'The current game data is not the latest data, some materials may be missing(Missing: {0})',
        access_denied: 'Permission Denied!(403)',
        not_found: 'Sorry, Page Not Found.(404)',
        server_err: 'Sorry, the server is down.(500)',
        api_failed: 'API Failed',

        net_err: 'Server network error or disconnected',
        proxy_in_function: 'the account is executing other instructions. Please wait a minute',
        game_failed: 'Login has expired, please restart account',
        login_failed: 'Game login error, please restart account',
        account_not_start: 'The current account has not been opened. Please go to account management to open',
        account_not_found: 'The account information does not exist or has been updated. Please resynchronize the account list',
        account_not_start_title: 'Error: the account has not been enabled',
        account_not_found_title: 'Error: unknown account',
        account_not_exist: 'The account is not opened or the information does not exist!',
        account: {
            create: {
                code_no_surplus: 'RegErr: invitation code has been used',
                account_already_exist: 'RegErr:username already exist',
                code_not_exist: 'RegErr: invalid invite code'
            },
        },
    },
    menu: {
        undefined: '',
        Login: '登录',
        reader: 'Story Reviewer',
        home: 'Home',
        dashboard: 'Dashboard',
        accounts: 'My Account',
        account_manage: 'Accounts Manage',
        settings: 'Settings',
        test: 'Test Page',
        about: 'About Us',
        cards: 'Cards',
        arkdb: 'ArkDB',
        gacha: 'Gacha',
        account: {
            dashboard: 'Dashboard',
        },
    },
    server: {
        title: 'Switch Server',
        title_diy: 'Custom Server Setting',
        desc: 'Please Confirm Switch to Server {0}?',
        desc_diy: 'Please Enter Your Custom Server Host(e.g. 192.168.1.1:8080)',
        host: 'Host',
        confirm: 'Confirm',
        cancel: 'Cancel',
        server: 'Server：{0}',
        secure: 'HTTPS Enabled：{0}',
        alert: '警告：切换服务器会强制退出当前账号，您需要重新进行登录；当目标服务器故障时；您可能无法正常进行登录；请点击左下角返回稳定服返回。',
        switch_suc: 'Server Switch Successfully',
        force_switch: 'Server Force Switch "{0}" to {1}://{2}',
        switch_err: 'Server Switch Error：Data Not Valid',
    },
    setting: {
        logout: 'Logout',
        settings: 'Settings',
        account_mng: 'Manage Accounts',
    },
    captcha:{
        title: 'Need Captcha',
        desc:"Current account requires captcha login, please wait for the following captcha operation to complete",
        status: "Status：{0}",
    },
    logout: 'Logout Successfully',
}